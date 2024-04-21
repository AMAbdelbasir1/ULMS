import { ErrorMessage } from 'src/utils';

export const errorMessage: ErrorMessage = {
  EXISTS_DEPARTMENT: {
    message: 'Department already exists',
    code: '400',
  },
  DEPARTMENT_NOT_FOUND: {
    message: 'Department not found.',
    code: '404',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  SEMESTER_NOT_FOUND: { message: 'Semester not found', code: '404' },
  CYCLE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
/**
  
 */
