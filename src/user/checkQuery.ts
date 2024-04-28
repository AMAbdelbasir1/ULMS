import { QueryResult } from 'src/database/database.entity';
import { CreateUserInput, CurrentUser } from './user.input';

export function updateCheckQuery(
  resultPromisesQuery: [QueryResult, QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
  faculty_ID: string,
) {
  const [existingUser, existingEmail, existingPhone, existingDepartment] =
    resultPromisesQuery;

  if (existingUser.recordset.length == 0) {
    throw 'NOT_EXIST_USER';
  }
  if (
    (existingUser.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
      faculty_ID) &&
    currentUser.roles.includes('ADMIN')
  ) {
    throw 'UNAUTHORIZED';
  }

  if (existingUser.recordset[0].Faculty_ID == faculty_ID && faculty_ID) {
    throw 'SAME_FACULTY_ID';
  }

  if (existingEmail.recordset.length > 0) {
    throw 'EXIST_EMAIL';
  }
  if (existingPhone.recordset.length > 0) {
    throw 'EXIST_PHONE';
  }
  if (existingDepartment.recordset.length == 0) {
    throw 'NOT_EXIST_DEPARTMENT';
  }
}

export function createCheckQuery(
  resultPromisesQuery: [
    QueryResult,
    QueryResult,
    QueryResult,
    QueryResult,
    QueryResult,
  ],
  createUserInput: CreateUserInput,
  currentUser: CurrentUser,
) {
  const [
    existingRole,
    existingEmail,
    existingFaculty,
    existingPhone,
    existingDepartment,
  ] = resultPromisesQuery;

  if (existingRole.recordset.length == 0) {
    throw 'NOT_EXIST_ROLE';
  }

  const existingRoleName = existingRole.recordset[0].name;

  if (existingRoleName == 'SUPERADMIN' && currentUser.roles.includes('ADMIN')) {
    throw 'UNAUTHORIZED';
  }

  if (
    existingRoleName !== 'SUPERADMIN' &&
    existingRoleName !== 'ADMIN' &&
    currentUser.roles.includes('SUPERADMIN')
  ) {
    throw 'UNAUTHORIZED';
  }

  if (
    existingRoleName !== 'SUPERADMIN' &&
    existingFaculty.recordset.length == 0 &&
    currentUser.roles.includes('SUPERADMIN')
  ) {
    throw 'FACULTY_NOT_FOUND';
  }

  if (existingEmail.recordset.length > 0) {
    throw 'EXIST_EMAIL';
  }

  if (existingPhone.recordset.length > 0) {
    throw 'EXIST_PHONE';
  }

  if (
    existingRoleName === 'STUDENT' &&
    (!createUserInput.academic_ID ||
      !createUserInput.level ||
      !createUserInput.department_ID)
  ) {
    throw 'STUDENT_INFORMATION_REQUIRED';
  }

  if (existingDepartment.recordset.length == 0) {
    throw 'NOT_EXIST_DEPARTMENT';
  }
}
