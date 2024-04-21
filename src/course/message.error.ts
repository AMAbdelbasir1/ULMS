import { ErrorMessage } from 'src/utils';

export const errorMessage: ErrorMessage = {
  NOT_IMAGE: {
    message: 'File not image',
    code: '400',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  COURSE_NOT_FOUND: { message: 'Course not found', code: '404' },
  EXISITS_COURSE: {
    message: 'Course already exists',
    code: '400',
  },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
