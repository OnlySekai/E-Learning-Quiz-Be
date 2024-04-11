import { PartialType } from '@nestjs/swagger';
import { QuizAnswerSheet } from 'src/database/schema/quiz-answers/quiz-answers.schema';

export class GetQuizSheetResponse extends PartialType(QuizAnswerSheet) {}
