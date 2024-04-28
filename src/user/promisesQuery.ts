import { DatabaseService } from '../database/database.service';
import { getDepartmentByFacultyQuery } from '../database/queries/department.query';
import { getOneRoleQuery } from '../database/queries/role.query';
import {
  getOneUserWithRoleQuery,
  getOneUserEmailQuery,
  getOneUserPhoneQuery,
} from '../database/queries/user.query';
import { CreateUserInput } from './user.input';
import { UpdateUserInput } from './user.input';
import { getOneFacultyQuery } from '../database/queries/faculty.query';

export async function createPromisesQuery(
  newUser: CreateUserInput,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneRoleQuery(newUser.role_ID)),
    conn.query(getOneUserEmailQuery(newUser.email)),
    (async () => {
      if (newUser.Faculty_ID) {
        return conn.query(getOneFacultyQuery(newUser.Faculty_ID));
      }
      return { recordset: [{ Faculty_ID: 'found' }] };
    })(),
    (async () => {
      if (newUser.phone) {
        return conn.query(getOneUserPhoneQuery(newUser.phone));
      }
      return { recordset: [] };
    })(),
    (async () => {
      if (newUser.department_ID) {
        return conn.query(
          getDepartmentByFacultyQuery(
            newUser.department_ID,
            newUser.Faculty_ID,
          ),
        );
      }
      return { recordset: [{ department_ID: 'found' }] };
    })(),
  ]);
}

export async function updatePromisesQuery(
  updateUserInput: UpdateUserInput,
  conn: DatabaseService,
) {
  const resultPromisesQuery = await Promise.all([
    conn.query(getOneUserWithRoleQuery(updateUserInput.user_ID)),
    conn.query(getOneUserEmailQuery(updateUserInput.email)),
    (async () => {
      if (updateUserInput.phone) {
        return conn.query(getOneUserPhoneQuery(updateUserInput.phone));
      }
      return { recordset: [] };
    })(),
    (async () => {
      if (updateUserInput.department_ID) {
        return conn.query(
          getDepartmentByFacultyQuery(
            updateUserInput.department_ID,
            updateUserInput.Faculty_ID,
          ),
        );
      }
      return { recordset: [{ faculty_ID: 'found' }] };
    })(),
  ]);

  return resultPromisesQuery;
}
