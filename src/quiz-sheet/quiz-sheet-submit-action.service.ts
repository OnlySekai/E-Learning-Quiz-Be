import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QUIZ_SHEET_CONFIG_TYPE, RATIO_TO_PASS } from 'src/config/constants';
import { MissionEntity } from 'src/database/schema/missions/missions.schema';
import {
  LeanerQuestionEntity,
  QuizAnswerSheetDocument,
} from 'src/database/schema/quiz-answers/quiz-answers.schema';
import {
  STUDY_STATUS,
  StudyPathEntity,
} from 'src/database/schema/study-path/study-path.schema';
import { MissionService } from 'src/missions/mission.service';
import { slitIdToNumbers } from 'src/utils';

export type HandlerSubmitAction = (
  quizSheet: QuizAnswerSheetDocument,
) => Promise<void>;

@Injectable()
export class QuizSheetSubmitActionService {
  constructor(
    @InjectModel(StudyPathEntity.name)
    private studyPathEntity: Model<StudyPathEntity>,
    @InjectModel(MissionEntity.name)
    private missionEntity: Model<MissionEntity>,
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
    const { questions, user, studyPath: studyPathId } = quizSheet;
    //delete all study path of user
    await this.studyPathEntity.deleteMany({
      user,
      _id: {
        $ne: studyPathId,
      },
    });
    //delete all mission of user
    await this.missionService.deleteAllMissionOfUser(user.toString());
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
    const unlockIndex = content.findIndex(
      (studyNode) => studyNode.status === STUDY_STATUS.LOCKED,
    );
    studyPath.unlockIndex = Math.max(unlockIndex, studyPath.unlockIndex);
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

  private async [QUIZ_SHEET_CONFIG_TYPE.LEVEL](
    quizSheet: QuizAnswerSheetDocument,
  ) {
    // Làm đúng 70% số câu hỏi thì unlock level tiếp theo
    const { questions, chapter, figure, level, user } = quizSheet;
    const numberCorrect = questions.filter((lq) => lq.correct).length;
    if (numberCorrect / questions.length >= RATIO_TO_PASS) {
      const studyPath = await this.studyPathEntity.findOne({ user });
      const { unlockIndex, content } = studyPath;
      const currentStudyNode = content[unlockIndex];
      if (!currentStudyNode) return;
      if (currentStudyNode.element !== `M${level}-D${figure}-C${chapter}`)
        return;
      currentStudyNode.status = STUDY_STATUS.COMPLETED;
      currentStudyNode.lastStudy = new Date();
      currentStudyNode.cntRepeat++;
      await this.missionEntity.updateMany(
        {
          user,
          id: `M${level}-D${figure}-C${chapter}`,
          course: studyPath.course,
        },
        {
          $set: {
            isComplete: true,
          },
        },
      );
      const nextStudyNode = content[unlockIndex + 1];
      studyPath.unlockIndex = unlockIndex + 1;
      if (nextStudyNode) {
        const nextNodeValue = slitIdToNumbers(nextStudyNode.element)
          .slice(1)
          .reverse()
          .reduce((acc, value) => acc * 100 + value, 0);
        const currentStudyNodeValue = chapter * 100 + figure;
        if (nextNodeValue > currentStudyNodeValue)
          studyPath.unlockIndex = unlockIndex;
      }
      await studyPath.save();
    }
  }

  private async [QUIZ_SHEET_CONFIG_TYPE.FIGURE](
    quizSheet: QuizAnswerSheetDocument,
  ) {
    const { questions, chapter, figure, user } = quizSheet;
    const numberCorrect = questions.filter((lq) => lq.correct).length;
    if (numberCorrect / questions.length >= RATIO_TO_PASS) {
      const studyPath = await this.studyPathEntity.findOne({ user });
      const { unlockIndex, content } = studyPath;
      const nextStudyNode = content[unlockIndex + 1];
      if (nextStudyNode) {
        const nextNodeValue = slitIdToNumbers(nextStudyNode.element)
          .slice(1)
          .reverse()
          .reduce((acc, value) => acc * 100 + value, 0);
        const currentStudyNodeValue = chapter * 100 + figure;
        if (nextNodeValue > currentStudyNodeValue) {
          studyPath.unlockIndex = unlockIndex + 1;
          await studyPath.save();
        }
      }
    }
  }
}
