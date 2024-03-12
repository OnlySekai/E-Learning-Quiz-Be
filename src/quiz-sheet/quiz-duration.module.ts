import { Module } from '@nestjs/common';
import { QuizDurationController } from './quiz-duration.controller';
import { QuizSheetService } from './quiz-sheet.service';
import { QuizSheetConfigModule } from 'src/quiz-sheet-config/quiz-sheet-config.module';

@Module({
  controllers: [QuizDurationController],
  providers: [QuizSheetService],
  imports: [QuizSheetConfigModule],
})
export class QuizDurationModule {}
