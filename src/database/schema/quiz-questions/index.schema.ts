import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { QuestionLevel, TypeQuizQuestion } from 'src/config/constants';

@Schema({
  discriminatorKey: 'type',
  timestamps: true,
  collection: 'quiz_questions',
})
export class QuizQuestion {
  @Prop({
    required: true,
    enum: TypeQuizQuestion,
    index: true,
  })
  type: number;

  @Prop({
    required: true,
  })
  question: string;

  @Prop({
    required: true,
    default: 0,
  })
  chapter: number;

  @Prop({
    required: true,
    enum: QuestionLevel,
    default: QuestionLevel.UNDERSTAND,
  })
  level: number;

  @Prop()
  note: string;

  @Prop({
    required: true,
    default: 1,
  })
  point: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  config: {
    answers: unknown[];
  };
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);
