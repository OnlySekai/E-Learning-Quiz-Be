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
  QuizSheetConfigType,
  TIME_UNIT,
} from '../config/constants';

@Injectable()
export class QuizSheetConfigService {
  constructor(
    @InjectModel(CourseEntity.name) private courseModel: Model<CourseEntity>,
  ) {}
  async getSheetConfigByRange(
    startChapter: number,
    endChapter: number,
  ): Promise<QuizSheetConfigModel> {
    const courseDetail = await this.courseModel.findOne().lean();
    if (!courseDetail) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const { chapters } = courseDetail;
    //filter chapter in range
    const chaptersInRange = chapters.filter(
      (chapter) =>
        chapter.chapterNumber >= startChapter &&
        chapter.chapterNumber <= endChapter,
    );
    if (chaptersInRange.length === 0) {
      throw new HttpException(
        'No chapter found in range',
        HttpStatus.NOT_FOUND,
      );
    }
    const content: QuizSheetConfigContentModel[] = [];
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
    return {
      type: QuizSheetConfigType.LEVEL,
      fixDuration: TIME_UNIT.HOUR,
      content,
    };
  }

  async getQuizSheetConfig() {
    return {
      quizDuration: 60,
      courseId: 'courseId',
      _id: '123',
      content: [
        {
          chapter: 0,
          numberOfQuestions: 1,
        },
        {
          chapter: 1,
          numberOfQuestions: 1,
        },
        {
          chapter: 2,
          numberOfQuestions: 1,
        },
        {
          chapter: 3,
          numberOfQuestions: 1,
        },
      ],
    };
  }
}
