import { ErrorMessage } from 'src/utils';

export const errorMessage: ErrorMessage = {
  EXISTS_ROLE: {
    message: 'Role already exists',
    code: '400',
  },
  CANNOT_ASSIGN_ROLE: {
    message: 'Cannot assign role: Some existing roles prevent this assignment.',
    code: '400',
  },
  ROLE_NOT_FOUND: {
    message: 'Role not found',
    code: '404',
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: '404',
  },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
