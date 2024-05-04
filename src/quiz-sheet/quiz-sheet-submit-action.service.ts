import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QUIZ_SHEET_CONFIG_TYPE } from 'src/config/constants';
import {
  LeanerQuestionEntity,
  QuizAnswerSheetDocument,
} from 'src/database/schema/quiz-answers/quiz-answers.schema';
import {
  STUDY_STATUS,
  StudyPathEntity,
} from 'src/database/schema/study-path/study-path.schema';
import { MissionService } from 'src/missions/mission.service';

export type HandlerSubmitAction = (
  quizSheet: QuizAnswerSheetDocument,
) => Promise<void>;

@Injectable()
export class QuizSheetSubmitActionService {
  constructor(
    @InjectModel(StudyPathEntity.name)
    private studyPathEntity: Model<StudyPathEntity>,
    private missionService: MissionService,
  ) {}
  getHandler(configSheetType: QUIZ_SHEET_CONFIG_TYPE): HandlerSubmitAction {
    const handler: HandlerSubmitAction =
      this[configSheetType] ?? async function () {};
    return handler.bind(this);
  }

  private async [QUIZ_SHEET_CONFIG_TYPE.INPUT](
    quizSheet: QuizAnswerSheetDocument,
  ) {
    const { questions } = quizSheet;
    const groupByChapterAndFigure = questions.reduce(
      (acc, leanerQuestion: LeanerQuestionEntity) => {
        const key = `D${leanerQuestion.question.figure}-C${leanerQuestion.question.chapter}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(leanerQuestion);
        return acc;
      },
      {} as Record<string, LeanerQuestionEntity[]>,
    );
    const notHaveToStudy = Object.entries(groupByChapterAndFigure)
      .filter(([, leanerQuestion]) => {
        const numberCorrect = leanerQuestion.filter((lq) => lq.correct).length;
        return numberCorrect / leanerQuestion.length >= 0.7;
      })
      .map(([studyNode]) => studyNode);
    const studyPath = await this.studyPathEntity
      .findById(quizSheet.studyPath)
      .populate('course');
    const { content } = studyPath;
    // remove element in content that is in notHaveToStudy
    content.forEach((studyNode) => {
      const figureChapterId = studyNode.element.split('-').slice(1).join('-');
      if (notHaveToStudy.includes(figureChapterId)) {
        studyNode.status = STUDY_STATUS.COMPLETED;
        studyNode.lastStudy = new Date();
      }
    });
    await studyPath.save();
    const studyNodeName = studyPath.course.chapters.reduce((acc, chapter) => {
      chapter.figures.forEach((figure) => {
        for (let x = 1; x <= 4; x++) {
          const key = `M${x}-D${figure.figureNumber}-C${chapter.chapterNumber}`;
          acc[
            key
          ] = `Chương ${chapter.chapterNumber}: ${figure.figureName} Mức ${x}`;
        }
      });
      return acc;
    }, {} as Record<string, string>);
    await this.missionService.createForInitStudyPath(
      studyPath.user.toString(),
      studyPath,
      {
        id: String(studyPath.course._id),
        elementName: studyNodeName,
      },
    );
  }
}
