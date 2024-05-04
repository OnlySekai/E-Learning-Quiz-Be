export enum TypeQuizQuestion {
  MULTIPLE_CHOICE = 0,
  TRUE_FALSE = 1,
  FILL_IN_THE_BLANK = 2,
}

export const QUESTION_LEVEL = {
  RECOGNIZE: 1,
  UNDERSTAND: 2,
  APPLY: 3,
  ANALYZE: 4,
};

// create const for number of Question level
export const NUMBER_QUESTION_LEVEL = Object.keys(QUESTION_LEVEL).length;

export const QUESTION_LEVEL_VALUES = Object.values(QUESTION_LEVEL);

export enum QUIZ_SHEET_CONFIG_TYPE {
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

export const NOTIFICATION_TYPE = {
  REPORT_QUESTION: 1,
};

export const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

export const TOKEN_EXPIRES_IN = TIME_UNIT.DAY * 7;
