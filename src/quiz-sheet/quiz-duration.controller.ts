import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuizSheetService } from './quiz-sheet.service';
import { SubmitAnswerRequest } from './dto/request/submit-anwser.request';
import { SubmitQuizSheetRequest } from './dto/request/submit-quiz-sheet.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetQuizSheetResponse } from './dto/response/get-quiz-sheet.response';
import { SubmitQuizSheetResponse } from './dto/response/submit-quiz-sheet.response';
import { SubmitAnswerSurveyRequest } from './dto/request/survay-answer.request';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Quiz')
@UseGuards(AuthGuard)
@Controller('quiz')
export class QuizDurationController {
  constructor(private readonly quizSheetService: QuizSheetService) {}

  @ApiOperation({ summary: 'Join a quiz' })
  @Post()
  joinQuiz(@Body() body: { studiedChapter: number[] }) {
    return this.quizSheetService.attemptQuizDemo(body.studiedChapter);
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

  @ApiOperation({ summary: 'Submit survey' })
  @Patch('/survey')
  submitSurvey(@Body() body: SubmitAnswerSurveyRequest): Promise<void> {
    return this.quizSheetService.submitAnswerSurvey(body);
  }
}
