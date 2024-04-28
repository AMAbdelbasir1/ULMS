import { QueryResult } from '../database/database.entity';
import { CurrentUser } from '../user/user.input';

export function createUserRoleCheckQuery(
  resultUserRolePromise: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingRole, existingUserRole, existingUser] = resultUserRolePromise;
  const preventRoles = {
    ADMIN: ['SUPERADMIN', 'STUDENT'],
    STUDENT: ['DOCTOR', 'SUPERADMIN', 'ADMIN', 'ASSISTANT'],
    DOCTOR: ['SUPERADMIN', 'STUDENT'],
  };
  if (existingRole.recordset.length === 0) {
    throw 'ROLE_NOT_FOUND';
  }

  if (currentUser.roles.includes('ADMIN')) {
    if (
      existingRole.recordset[0].name == 'SUPERADMIN' ||
      (existingUser.recordset.length > 0 &&
        existingUser.recordset[0].Faculty_ID !== currentUser.Faculty_ID)
    ) {
      throw 'UNAUTHORIZED';
    }
  }
  if (existingUserRole.recordset.length > 0) {
    throw 'EXIST_ROLE';
  }
  if (existingUser.recordset.length == 0) {
    throw 'USER_NOT_FOUND';
  }
  const existingUserRoles = existingUser.recordset.map(
    (record) => record.roles,
  );
  for (const role of existingUserRoles) {
    if (
      (preventRoles[role as string] &&
        preventRoles[role as string].includes(
          existingRole.recordset[0].name,
        )) ||
      role == 'SUPERADMIN'
    ) {
      throw 'CANNOT_ASSIGN_ROLE';
    }
  }
}

export function deleteUserRoleCheckQuery(
  resultUserRolePromise: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingUserRole, existingUser] = resultUserRolePromise;
  if (currentUser.roles.includes('ADMIN')) {
    if (
      existingUser.recordset.length > 0 &&
      existingUser.recordset[0].Faculty_ID !== currentUser.Faculty_ID
    ) {
      throw 'UNAUTHORIZED';
    }
  }
  if (existingUserRole.recordset.length == 0) {
    throw 'ROLE_NOT_FOUND';
  }
}
