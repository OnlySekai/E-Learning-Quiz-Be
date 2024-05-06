import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  QuizSheetConfigContentModel,
  QuizSheetConfigModel,
} from './models/quiz-sheet-config.model';
import { InjectModel } from '@nestjs/mongoose';
import { CourseEntity } from '../database/schema/courses/course.schema';
import { Model } from 'mongoose';
import {
  QUESTION_LEVEL_VALUES,
  REPEAT_CONTENT,
  TIME_UNIT,
} from '../config/constants';
import { AttemptQuizLevelRequest } from './dto/request/attempt-quiz-level.request';
import { slitIdToNumbers } from 'src/utils';

@Injectable()
export class QuizSheetConfigService {
  constructor(
    @InjectModel(CourseEntity.name) private courseModel: Model<CourseEntity>,
  ) {}
  async getSheetConfigByRange(
    startContent: number[],
    endContent: number[],
  ): Promise<QuizSheetConfigModel> {
    const courseDetail = await this.courseModel.findOne().lean();
    if (!courseDetail) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const { chapters } = courseDetail;
    //filter chapter in range
    const chaptersInRange = chapters.filter(
      (chapter) =>
        chapter.chapterNumber >= startContent[0] &&
        chapter.chapterNumber <= endContent[0],
    );
    if (chaptersInRange.length === 0) {
      throw new HttpException(
        'No chapter found in range',
        HttpStatus.NOT_FOUND,
      );
    }
    const content: QuizSheetConfigContentModel[] = [];
    if (chaptersInRange.length === 1) {
      chaptersInRange[0].figures
        .filter(
          ({ figureNumber }) =>
            figureNumber >= startContent[1] && figureNumber <= endContent[1],
        )
        .forEach(({ figureNumber }) => {
          for (const lv of QUESTION_LEVEL_VALUES) {
            content.push({
              chapter: chaptersInRange[0].chapterNumber,
              figure: figureNumber,
              lv,
              total: 1,
            });
          }
        });
    } else {
      chaptersInRange.at(0).figures = chaptersInRange
        .at(0)
        .figures.filter(({ figureNumber }) => figureNumber >= startContent[1]);
      chaptersInRange.at(-1).figures = chaptersInRange
        .at(-1)
        .figures.filter(({ figureNumber }) => figureNumber <= endContent[1]);
      for (const chapter of chaptersInRange) {
        for (const figure of chapter.figures) {
          for (const lv of QUESTION_LEVEL_VALUES) {
            content.push({
              chapter: chapter.chapterNumber,
              figure: figure.figureNumber,
              lv,
              total: 1,
            });
          }
        }
      }
    }
    return {
      fixDuration: TIME_UNIT.HOUR * 1.5,
      content,
    };
  }
  getSheetByLevel({
    chapter,
    figure,
    level,
  }: AttemptQuizLevelRequest): QuizSheetConfigModel {
    return {
      fixDuration: TIME_UNIT.MINUTE * 30,
      content: [
        {
          chapter,
          figure,
          lv: level,
          total: 4,
        },
      ],
    };
  }
  getSheetEndFigure(figureId: string): QuizSheetConfigModel {
    const figureIdsMustStudy = REPEAT_CONTENT[figureId];
    if (!figureIdsMustStudy) {
      throw new HttpException('Figure not found', HttpStatus.NOT_FOUND);
    }
    const content: QuizSheetConfigContentModel[] = [];
    for (const figureIdMustStudy of figureIdsMustStudy) {
      const [figure, chapter] = slitIdToNumbers(figureIdMustStudy);
      for (const lv of QUESTION_LEVEL_VALUES) {
        content.push({
          chapter,
          figure,
          lv,
          total: 1,
        });
      }
    }
    return {
      fixDuration: TIME_UNIT.HOUR * 1,
      content,
    };
  }
}
