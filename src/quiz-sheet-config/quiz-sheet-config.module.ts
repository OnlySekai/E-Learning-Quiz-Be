import { Module } from '@nestjs/common';
import { QuizSheetConfigService } from './quiz-sheet-config.service';

@Module({
  providers: [QuizSheetConfigService],
  exports: [QuizSheetConfigService],
})
export class QuizSheetConfigModule {}
