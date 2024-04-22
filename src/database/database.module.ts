import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizQuestionEntity,
  QuizQuestionSchema,
} from './schema/quiz-questions/quiz-question.schema';
import {
  QuizAnswerSheetEntity,
  QuizAnswerSheetSchema,
} from './schema/quiz-answers/quiz-answers.schema';
import {
  MultipleChoiceQuizQuestionEntity,
  MultipleChoiceQuizQuestionSchema,
} from './schema/quiz-questions/multiple-choice.schema';
import { CourseEntity, CourseSchema } from './schema/courses/course.schema';
import {
  NotificationEntity,
  NotificationSchema,
} from './schema/notification/notifications.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAnswerSheetEntity.name,
        schema: QuizAnswerSheetSchema,
      },
      {
        name: QuizQuestionEntity.name,
        schema: QuizQuestionSchema,
        discriminators: [
          {
            name: MultipleChoiceQuizQuestionEntity.name,
            schema: MultipleChoiceQuizQuestionSchema,
          },
        ],
      },
      {
        name: CourseEntity.name,
        schema: CourseSchema,
      },
      {
        name: NotificationEntity.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
