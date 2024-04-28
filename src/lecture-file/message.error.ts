import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  LECTURE_NOT_FOUND: {
    message: 'Lecture not found',
    code: '404',
  },
  MAX_FILE_SIZE: {
    message: 'File must be less than 5M',
    code: '400',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  CAN_NOT_CHANGE: { message: 'Can not change type', code: '401' },
  CYCLE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
  CYCLE_NOT_RUNNING: { message: 'Course cycle not running', code: '404' },
  CYCLE_ENDED: { message: 'Course cycle ended', code: '400' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
