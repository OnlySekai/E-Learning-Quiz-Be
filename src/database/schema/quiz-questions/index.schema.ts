import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { TypeQuizQuestion } from 'src/config/constants';

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

  @Prop()
  note: string;

  @Prop({
    required: true,
    default: 1,
  })
  point: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  config: Object;
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);
