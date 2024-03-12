import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizSheetConfigService {
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
