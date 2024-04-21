import { ErrorMessage } from 'src/utils';

export const errorMessage: ErrorMessage = {
  EXISTS_FACULTY: {
    message: 'Faculty already exists',
    code: '400',
  },
  DEPARTMENT_FOUND: {
    message: "Can not remove Faculty ,it's assgined to Departments",
    code: '400',
  },
  NOT_IMAGE: {
    message: 'File not image',
    code: '400',
  },
  DEPARTMENT_NOT_FOUND: {
    message: 'Department not found.',
    code: '404',
  },
  UNIVERSITY_NOT_FOUND: { message: 'University not found.', code: '404' },
  FACULTY_NOT_FOUND: { message: 'Faculty not found.', code: '404' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
/**
 
 */
