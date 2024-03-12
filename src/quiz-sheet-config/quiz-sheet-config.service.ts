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
          chapter: 1,
          numberOfQuestions: 4,
        },
        {
          chapter: 2,
          numberOfQuestions: 4,
        },
        {
          chapter: 3,
          numberOfQuestions: 4,
        },
        {
          chapter: 4,
          numberOfQuestions: 4,
        },
      ],
    };
  }
}
