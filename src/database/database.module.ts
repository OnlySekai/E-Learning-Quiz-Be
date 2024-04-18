import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from './schema/quiz-questions/quiz-question.schema';
import {
  QuizAnswerSheet,
  QuizAnswerSchema,
} from './schema/quiz-answers/quiz-answers.schema';
import {
  MultipleChoiceQuizQuestion,
  MultipleChoiceQuizQuestionSchema,
} from './schema/quiz-questions/multiple-choice.schema';
import { CourseEntity, CourseSchema } from './schema/courses/course.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAnswerSheet.name,
        schema: QuizAnswerSchema,
      },
      {
        name: QuizQuestion.name,
        schema: QuizQuestionSchema,
        discriminators: [
          {
            name: MultipleChoiceQuizQuestion.name,
            schema: MultipleChoiceQuizQuestionSchema,
          },
        ],
      },
      {
        name: CourseEntity.name,
        schema: CourseSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
