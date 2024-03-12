import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, HydratedDocument } from 'mongoose';
import { QuizQuestion } from './quiz-questions/index.schema';

@Schema()
export class AnswerHistory {
  @Prop({
    required: true,
  })
  answer: unknown[];

  @Prop({
    required: true,
  })
  duration: number;
}

const AnswerHistorySchema = SchemaFactory.createForClass(AnswerHistory);

@Schema()
export class LeanerQuestion {
  @Prop({ type: SchemaTypes.ObjectId, ref: QuizQuestion.name, required: true })
  question: QuizQuestion;

  @Prop({
    type: [AnswerHistorySchema],
  })
  histories: AnswerHistory[];

  @Prop({
    required: true,
    default: false,
  })
  correct: boolean;
}

const LeanerQuestionSchema = SchemaFactory.createForClass(LeanerQuestion);

@Schema({ collection: 'quiz_answer_sheet' })
export class QuizAnswerSheet {
  //TODO: Contest
  //TODO: Leaner
  @Prop({
    required: true,
  })
  configId: string;
  @Prop({
    required: true,
  })
  courseId: string;
  @Prop({
    required: true,
  })
  quizDuration: number;
  @Prop({
    type: [LeanerQuestionSchema],
  })
  questions: LeanerQuestion[];
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswerSheet);
export type QuizAnswerSheetDocument = HydratedDocument<QuizAnswerSheet>;
