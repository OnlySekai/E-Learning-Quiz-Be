import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import * as _ from 'lodash';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import { QuizAnswerSheetEntity } from 'src/database/schema/quiz-answers/quiz-answers.schema';
import { QuizSheetConfigService } from 'src/quiz-sheet/quiz-sheet-config.service';
import { QuizQuestionEntity } from 'src/database/schema/quiz-questions/quiz-question.schema';
import { CreateQuizSheetResponse } from './dto/response/create-quiz-sheet.response';
import { SubmitQuizSheetResponse } from './dto/response/submit-quiz-sheet.response';
import { SubmitAnswerRequest } from './dto/request/submit-anwser.request';
import { SubmitAnswerSurveyRequest } from './dto/request/survay-answer.request';

@Injectable()
export class QuizSheetService {
  constructor(
    @InjectModel(QuizAnswerSheetEntity.name)
    private readonly quizSheetModel: Model<QuizAnswerSheetEntity>,
    @InjectModel(QuizQuestionEntity.name)
    private readonly quizQuestionModel: Model<QuizQuestionEntity>,
    private readonly quizSheetConfigService: QuizSheetConfigService,
  ) {}

  async attemptQuizDemo(
    studiedChapter: number[],
  ): Promise<CreateQuizSheetResponse> {
    //TODO: Get sheet config
    const sheetConfig = await this.quizSheetConfigService.getSheetConfigByRange(
      [1, 1],
      studiedChapter,
    );
    //TODO: Get questions
    const {
      fixDuration: quizDuration,
      content,
      type: configType,
    } = sheetConfig;
    const questionPromises = content.map((config) => {
      const { figure, chapter, lv: level, total } = config;
      //get random questions from chapter
      return this.quizQuestionModel
        .aggregate()
        .match({ chapter, figure, level })
        .sample(total)
        .project({ _id: 1 })
        .exec();
    });

    const questions = await Promise.all(questionPromises);
    const questionIds = questions.flat().map(({ _id }) => _id);
    //TODO: Create new sheet
    const newSheet = new this.quizSheetModel({
      configType,
      quizDuration,
      questions: questionIds.map((question) => ({
        question,
        histories: [],
        correct: false,
      })),
    });
    await newSheet.save();
    return {
      sheetId: newSheet._id.toString(),
      createdAt: newSheet.createdAt,
      quizDuration,
    };
  }

  async getQuizSheet(
    sheetId: string,
    omitKey = false,
  ): Promise<GetQuizSheetResponse> {
    const quizSheet: QuizAnswerSheetEntity = await this.quizSheetModel
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

  async submitQuestion({
    sheetId,
    questionIdx,
    answers: userAnswers,
    duration,
  }: SubmitAnswerRequest) {
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
          [`questions.${questionIdx}.correct`]: isCorrect,
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

  async submitQuizSheet(sheetId: string): Promise<SubmitQuizSheetResponse> {
    const quizSheet = await this.quizSheetModel
      .findById(sheetId)
      .populate('questions.question', 'point', this.quizQuestionModel)
      .lean();
    if (!quizSheet)
      throw new HttpException('Not found Quiz Sheet', HttpStatus.NOT_FOUND);
    const correctAnswers = quizSheet.questions.filter(({ correct }) => correct);
    const totalScore = correctAnswers.reduce(
      (acc, { question }) => acc + question.point,
      0,
    );
    const { modifiedCount } = await this.quizSheetModel.updateOne(
      {
        _id: new Types.ObjectId(sheetId),
        submittedAt: null,
      },
      {
        $set: {
          submittedAt: new Date(),
          score: totalScore,
        },
      },
    );
    if (!modifiedCount)
      throw new HttpException(
        'Quiz sheet have been submitted',
        HttpStatus.BAD_REQUEST,
      );
    return {
      sheetId,
      score: totalScore,
      correctAnswers: correctAnswers.length,
    };
  }

  async submitAnswerSurvey({
    questionIdx,
    isRandom,
    isWeak,
    sheetId,
  }: SubmitAnswerSurveyRequest) {
    const quizSheet = await this.quizSheetModel.findById(sheetId);
    const questionConfig = quizSheet.questions.at(questionIdx);
    if (!questionConfig)
      throw new HttpException('Not found question', HttpStatus.NOT_FOUND);
    questionConfig.isRandom = isRandom;
    questionConfig.isWeak = isWeak;
    await quizSheet.save();
  }
}
