import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  SEMESTER_NOT_RUNNING: {
    message: 'Faculty has not semester running',
    code: '400',
  },
  COURSE_NOT_FOUND: {
    message: 'One of courses you select not found',
    code: '404',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  SEMESTER_NOT_FOUND: { message: 'Semester not found', code: '404' },
  CYCLE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
