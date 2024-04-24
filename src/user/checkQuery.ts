import { QueryResult } from 'src/database/database.entity';
import { CurrentUser } from './user.input';

export async function updateCheckQuery(
  resultPromisesQuery: [QueryResult, QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingUser, existingEmail, existingPhone, existingDepartment] =
    resultPromisesQuery;

  if (existingUser.recordset.length == 0) {
    throw 'NOT_EXIST_USER';
  }
  if (
    existingUser.recordset[0].Faculty_ID !== currentUser.Faculty_ID &&
    currentUser.roles.includes('ADMIN')
  ) {
    throw 'UNAUTHORIZED';
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

export async function createCheckQuery(
  resultPromisesQuery: [
    QueryResult,
    QueryResult,
    QueryResult,
    QueryResult,
    QueryResult,
  ],
  Faculty_ID: string,
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
    resultPromisesQuery[0].recordset[0].name !== 'SUPERADMIN' &&
    !Faculty_ID
  ) {
    throw 'FACULTY_REQUIRED';
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

  if (existingDepartment.recordset.length == 0) {
    throw 'NOT_EXIST_DEPARTMENT';
  }
}
