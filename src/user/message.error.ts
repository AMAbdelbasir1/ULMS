export const errorMessage = {
  NOT_EXIST_USER: { message: 'User not found', code: '404' },
  NOT_EXIST_ROLE: { message: 'User not found', code: '404' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  EXIST_EMAIL: { message: 'Email used by another user', code: '400' },
  EXIST_PHONE: { message: 'Phone used by another user', code: '400' },
  NOT_EXIST_DEPARTMENT: {
    message: 'Department you select not found',
    code: '404',
  },
  FACULTY_REQUIRED: {
    message: 'Faculty required',
    code: '400',
  },
  FACULTY_NOT_FOUND: {
    message: 'Faculty not found',
    code: '404',
  },
  SAME_FACULTY_ID: {
    message: 'User already exists with the same faculty',
    code: '400',
  },
  STUDENT_INFORMATION_REQUIRED: {
    message: 'Student information required',
    code: '400',
  },
  NOT_IMAGE: { message: 'File not image', code: '400' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
