import { Module } from '@nestjs/common';
import { QuizDurationController } from './quiz-duration.controller';
import { QuizSheetService } from './quiz-sheet.service';
import { QuizSheetConfigService } from './quiz-sheet-config.service';
@Module({
  controllers: [QuizDurationController],
  providers: [QuizSheetService, QuizSheetConfigService],
})
export class QuizDurationModule {}
