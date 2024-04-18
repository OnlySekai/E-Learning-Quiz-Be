export enum TypeQuizQuestion {
  MULTIPLE_CHOICE = 0,
  TRUE_FALSE = 1,
  FILL_IN_THE_BLANK = 2,
}

export const QUESTION_LEVEL = {
  RECOGNIZE: 0,
  UNDERSTAND: 1,
  APPLY: 2,
  ANALYZE: 3,
};

// create const for number of Question level
export const NUMBER_QUESTION_LEVEL = Object.keys(QUESTION_LEVEL).length;

export const QUESTION_LEVEL_VALUES = Object.values(QUESTION_LEVEL);

export enum QuizSheetConfigType {
  INPUT = 0,
  LEVEL = 1,
  FIGURE = 2,
  EXAM = 3,
}

export const TIME_UNIT = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};
