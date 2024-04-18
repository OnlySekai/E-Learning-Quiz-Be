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
import { SubmitQuizSheetRequest } from './dto/request/submit-quiz-sheet.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import { SubmitQuizSheetResponse } from './dto/response/submit-quiz-sheet.response';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizDurationController {
  constructor(private readonly quizSheetService: QuizSheetService) {}

  @ApiOperation({ summary: 'Join a quiz' })
  @Post()
  joinQuiz() {
    return this.quizSheetService.attemptQuizDemo();
  }

  @ApiOperation({ summary: 'Get a quiz session' })
  @Get('/:id')
  getQuizSession(@Param('id') sheetId: string): Promise<GetQuizSheetResponse> {
    return this.quizSheetService.getQuizSheet(sheetId);
  }

  @ApiOperation({ summary: 'Submit a quiz' })
  @Patch()
  submitQuiz(
    @Body() body: SubmitQuizSheetRequest,
  ): Promise<SubmitQuizSheetResponse> {
    return this.quizSheetService.submitQuizSheet(body.sheetId);
  }

  @ApiOperation({ summary: 'Submit an answer' })
  @Put()
  submitAnswer(@Body() body: SubmitAnswerRequest): Promise<void> {
    return this.quizSheetService.submitQuestion(body);
  }
}
