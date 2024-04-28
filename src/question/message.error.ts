import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  QUIZ_NOT_FOUND: { message: 'Quiz not found.', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  INVALID_DATE: { message: 'Date that entered not valid', code: '400' },
  QUIZ_NOT_RUNNING: { message: 'Quiz not running', code: '404' },
  QUIZ_ENDED: { message: 'Quiz ended', code: '400' },
  COURSE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
  IS_TRUE_ANSWER: { message: 'Can not remove true answer', code: '400' },
  IS_TRUE: { message: 'Answer already is true', code: '400' },
  TOTAL_GRADE_NOT_MATCH: {
    message: 'Total questions grade not match with quiz grade',
    code: '400',
  },
};
