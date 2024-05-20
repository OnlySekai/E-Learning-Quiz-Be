import { Injectable } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizQuestionEntity } from 'src/database/schema/quiz-questions/quiz-question.schema';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(QuizQuestionEntity.name)
    private readonly quizQuestionModel: Model<QuizQuestionEntity>,
  ) {}
  create(createQuestionDto: CreateQuestionDto) {
    return this.quizQuestionModel.create(createQuestionDto);
  }

  async findAll(limit = 20, page = 0) {
    const questions = await this.quizQuestionModel
      .find()
      .limit(limit)
      .skip(limit * page);
    const total = await this.quizQuestionModel.countDocuments();
    return {
      questions,
      total,
    };
  }

  async findOne(id: string) {
    return await this.quizQuestionModel.findById(id);
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.quizQuestionModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.quizQuestionModel.findByIdAndDelete(id);
  }
}
