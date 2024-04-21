export const errorMessage = {
  SEMESTER_RUNING: {
    message: 'Faculty has already sesmester inprogress',
    code: '400',
  },
  SEMESTER_FOUND: {
    message: 'semester with the same years and number already exists',
    code: '400',
  },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  SEMESTER_NOT_FOUND: { message: 'Semester not found', code: '404' },
  UNABLE_START_DATE: {
    message: 'Start date must be less than end date',
    code: '400',
  },
  UNABLE_END_DATE: {
    message: 'End date must be greater than start date',
    code: '400',
  },
  FULL_YEAR: {
    message: 'Year already has two semester',
    code: '400',
  },
  ENTER_DATA: { message: 'Data missing', code: '400' },
};
