import { QuizSheetConfigType } from 'src/config/constants';

export interface QuizSheetConfigModel {
  type: QuizSheetConfigType;
  fixDuration?: number;
  perDuration?: number;
  content: QuizSheetConfigContentModel[];
}

export interface QuizSheetConfigContentModel {
  chapter: number;
  figure: number;
  lv: number;
  total: number;
}
