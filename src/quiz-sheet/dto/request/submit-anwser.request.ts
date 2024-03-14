export class SubmitAnswerRequest {
  sheetId: string;
  questionId: number;
  answer: unknown[];
  duration: number;
}
