import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { QuizQuestion } from './index.schema';

@Schema()
export class MultipleChoiceConfig {
  @Prop({
    required: true,
    default: [],
  })
  answers: number[];

  @Prop({
    required: true,
    minlength: 2,
  })
  options: string[];

  @Prop({
    required: true,
    default: 1,
  })
  @Prop({
    required: true,
    default: false,
  })
  componentScore: boolean;
}
export const MultipleChoiceConfigSchema =
  SchemaFactory.createForClass(MultipleChoiceConfig);

@Schema()
export class MultipleChoiceQuizQuestion implements QuizQuestion {
  type: number;
  question: string;
  note: string;
  point: number;
  chapter: number;
  level: number;
  @Prop({
    type: MultipleChoiceConfigSchema,
    required: true,
  })
  declare config: MultipleChoiceConfig;
}

export const MultipleChoiceQuizQuestionSchema = SchemaFactory.createForClass(
  MultipleChoiceQuizQuestion,
);
