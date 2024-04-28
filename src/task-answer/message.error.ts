import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  TASK_NOT_FOUND: { message: 'Task not found.', code: '404' },
  TASK_ANSWER_NOT_FOUND: { message: 'Task answer not found.', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  FILE_NOT_FOUND: { message: 'File not found', code: '404' },
  CYCLE_NOT_RUNNING: { message: 'Course cycle not running', code: '404' },
  CYCLE_ENDED: { message: 'Course cycle ended', code: '400' },
  TASK_NOT_RUNNING: { message: 'Task not running', code: '404' },
  TASK_ENDED: { message: 'Task ended', code: '400' },
  COURSE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
};
