import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { QuizSheetService } from './quiz-sheet.service';

@Controller('quiz')
export class QuizDurationController {
  constructor(private readonly quizSheetService: QuizSheetService) {}
  @Post()
  joinQuiz() {
    return this.quizSheetService.attemptQuiz();
  }
  @Get('/:id')
  getQuizSession(@Param('id') sheetId: string) {
    return this.quizSheetService.getQuizSheet(sheetId);
  }
  @Patch()
  submitQuiz() {
    //TODO: calculate point and re-build study path
  }
  @Put()
  submitAnswer() {}
  @Delete()
  removeAnswer() {}
}
