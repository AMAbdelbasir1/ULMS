import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  EXISTS_ROLE: {
    message: 'Role already exists',
    code: '400',
  },
  ROLE_NOT_FOUND: {
    message: 'Role not found',
    code: '404',
  },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};