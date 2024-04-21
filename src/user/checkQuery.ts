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
  resultPromisesQuery: [QueryResult, QueryResult, QueryResult, QueryResult],
  Faculty_ID: string,
  currentUser: CurrentUser,
) {
  const [existingRole, existingEmail, existingPhone, existingDepartment] =
    resultPromisesQuery;

  if (existingRole.recordset.length == 0) {
    throw 'NOT_EXIST_ROLE';
  } else if (
    existingRole.recordset[0].name == 'SUPERADMIN' &&
    currentUser.roles.includes('ADMIN')
  ) {
    throw 'UNAUTHORIZED';
  } else if (
    resultPromisesQuery[0].recordset[0].name !== 'SUPERADMIN' &&
    !Faculty_ID
  ) {
    throw 'FACULTY_REQUIRED';
  } else if (existingEmail.recordset.length > 0) {
    throw 'EXIST_EMAIL';
  } else if (existingPhone.recordset.length > 0) {
    throw 'EXIST_PHONE';
  } else if (existingDepartment.recordset.length == 0) {
    throw 'NOT_EXIST_DEPARTMENT';
  }
}
