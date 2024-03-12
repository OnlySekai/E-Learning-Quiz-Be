import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as _ from 'lodash';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import { QuizAnswerSheet } from 'src/database/schema/quiz-answers.schema';
import { QuizSheetConfigService } from 'src/quiz-sheet-config/quiz-sheet-config.service';
import { QuizQuestion } from 'src/database/schema/quiz-questions/index.schema';
import { CreateQuizSheetResponse } from './dto/response/create-quiz-sheet.response';

@Injectable()
export class QuizSheetService {
  constructor(
    @InjectModel(QuizAnswerSheet.name)
    private readonly quizSheetModel: Model<QuizAnswerSheet>,
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: Model<QuizQuestion>,
    private readonly quizSheetConfigService: QuizSheetConfigService,
  ) {}

  async attemptQuiz(): Promise<CreateQuizSheetResponse> {
    //TODO: Get sheet config
    const sheetConfig = await this.quizSheetConfigService.getQuizSheetConfig();
    //TODO: Get questions
    const { quizDuration, courseId, content, _id } = sheetConfig;
    const questionPromises = content.map((config) => {
      const { chapter, numberOfQuestions } = config;
      //get random questions from chapter
      return this.quizQuestionModel
        .aggregate()
        .match({ chapter })
        .sample(numberOfQuestions)
        .project({ _id: 1 })
        .exec();
    });

    const questions = await Promise.all(questionPromises);
    const questionIds = questions.flat().map(({ _id }) => _id);
    //TODO: Create new sheet
    const newSheet = new this.quizSheetModel({
      configId: _id,
      courseId,
      quizDuration,
      questions: questionIds.map((question) => ({ question })),
    });
    await newSheet.save();
    return {
      sheetId: newSheet._id.toString(),
      createdAt: newSheet.createdAt.toISOString(),
      quizDuration,
    };
  }

  async getQuizSheet(
    sheetId: string,
    omitKey = true,
  ): Promise<GetQuizSheetResponse> {
    const quizSheet: QuizAnswerSheet = await this.quizSheetModel
      .findById(sheetId)
      .populate('questions.question', '', this.quizQuestionModel)
      .lean();
    if (!quizSheet)
      throw new HttpException('Not found Quiz Sheet', HttpStatus.NOT_FOUND);
    //Omit answers in sheet
    if (omitKey)
      quizSheet.questions.forEach(({ question }) => {
        question.config.answers = [];
      });
    return quizSheet as GetQuizSheetResponse;
  }

  async submitQuestion(
    sheetId: string,
    questionIdx: number,
    userAnswers: unknown[],
    duration: number,
  ) {
    const quizSheet = await this.quizSheetModel
      .findById(sheetId)
      .slice('questions', [questionIdx, 1])
      .populate('questions.question', 'config.answers', this.quizQuestionModel)
      .lean();
    if (!quizSheet || !quizSheet.questions.length)
      throw new HttpException('Not found question', HttpStatus.NOT_FOUND);
    const [questionInfo] = quizSheet.questions;
    const {
      question: {
        config: { answers },
      },
    } = questionInfo;
    const isCorrect = _.isEqual(_.sortBy(userAnswers), _.sortBy(answers));
    await this.quizSheetModel.updateOne(
      {
        _id: new Types.ObjectId(sheetId),
      },
      {
        $set: {
          [`questions.${questionIdx}.duration`]: duration,
          [`questions.${questionIdx}.correct`]: isCorrect,
          [`questions.${questionIdx}.answers`]: userAnswers,
        },
        $push: {
          [`questions.${questionIdx}.histories`]: {
            duration,
            answers: userAnswers,
            correct: isCorrect,
          },
        },
      },
    );
  }
}
