import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';

@Controller('quiz-duration/:id')
export class QuizDurationController {
  @Post()
  joinQuiz() {
    //TODO: Create session for quiz duration
  }
  @Get() 
  getQuizSession() {
    //TODO: Get quiz session when user disconnects or reviews quiz
  }
  @Patch()
  submitQuiz() {
    //TODO: calculate point and re-build study path
  }
  @Put()
  submitAnswer() {

  }
  @Delete()
  removeAnswer() {
    
  }
}