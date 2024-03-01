import { Module } from '@nestjs/common';
import { QuizDurationController } from './quiz-duration.controller';
import { QuizDurationService } from './quiz-duration.service';

@Module({
  // imports: [],
  controllers: [QuizDurationController],
  providers: [QuizDurationService],
})
export class QuizDurationModule {}
