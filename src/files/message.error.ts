import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  FILE_NOT_FOUND: {
    message: 'file not found',
    code: '404',
  },
  FILE_NOT_AVAILABLE: {
    message: 'file not available',
    code: '400',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
};
