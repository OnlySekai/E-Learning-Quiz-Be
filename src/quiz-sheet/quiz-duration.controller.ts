import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { QuizSheetService } from './quiz-sheet.service';
import { SubmitAnswerRequest } from './dto/request/submit-anwser.request';
import { SubmitQuizSheetRequest } from './dto/request/submit-quiz-sheet.response';

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
  submitQuiz(@Body() body: SubmitQuizSheetRequest) {
    return this.quizSheetService.submitQuizSheet(body.sheetId);
  }
  @Put()
  submitAnswer(@Body() body: SubmitAnswerRequest) {
    const { sheetId, questionId, duration, answer } = body;
    //TODO:
    return this.quizSheetService.submitQuestion(
      sheetId,
      questionId,
      answer,
      duration,
    );
  }
  @Delete()
  removeAnswer() {}
}
