import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  EXISTS_UNIVERSITY: {
    message: 'University already exists',
    code: '400',
  },
  EXISTS_FACULTY: {
    message: "Can not remove University ,it's assgined to faculties",
    code: '400',
  },
  UNIVERSITY_NOT_FOUND: { message: 'University not found.', code: '404' },
  NOT_IMAGE: {
    message: 'File not image',
    code: '400',
  },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
