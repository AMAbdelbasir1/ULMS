import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  QUIZ_NOT_FOUND: { message: 'Quiz not found.', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  INVALID_DATE: { message: 'Date that entered not valid', code: '400' },
  CYCLE_NOT_RUNNING: { message: 'Course cycle not running', code: '404' },
  CYCLE_ENDED: { message: 'Course cycle ended', code: '400' },
  COURSE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
};
