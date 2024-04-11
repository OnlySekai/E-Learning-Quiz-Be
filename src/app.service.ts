import { Injectable } from '@nestjs/common';
// import { MongoDbService } from './database/mongodb.service';
import { InjectModel } from '@nestjs/mongoose';
import { QuizAnswerSheet } from './database/schema/quiz-answers/quiz-answers.schema';
import { Model } from 'mongoose';
import { QuizQuestion } from './database/schema/quiz-questions/quiz-question.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(QuizAnswerSheet.name) private quizAnswerModel: Model<QuizAnswerSheet>,
    @InjectModel(QuizQuestion.name) private quizQuestionModel: Model<QuizQuestion>,
  ) {}
  async getHello(): Promise<string> {
    const questions = await this.quizAnswerModel.find({});
    await this.quizAnswerModel.insertMany([{
      answer: 'A',
      question: {
        config: {
          tuan: 123
        }
      }
    }])
    console.log(questions);
    return 'Hello World!';
  }
}
