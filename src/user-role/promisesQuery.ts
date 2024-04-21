import { DatabaseService } from 'src/database/database.service';
import { getOneRoleQuery } from 'src/database/queries/role.query';
import { getOneUserRoleQuery } from 'src/database/queries/user-role.query';
import { getOneUserQuery, getOneUserWithRoleQuery } from 'src/database/queries/user.query';
import { UserRoleInput } from './user-role.input';

export async function createUserRolePromisesQuery(
  insertInput: UserRoleInput,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneRoleQuery(insertInput.role_ID)),
    conn.query(getOneUserRoleQuery(insertInput.role_ID, insertInput.user_ID)),
    conn.query(getOneUserWithRoleQuery(insertInput.user_ID)),
  ]);
}

export async function deleteUserRolePromisesQuery(
  deleteInput: UserRoleInput,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneUserRoleQuery(deleteInput.role_ID, deleteInput.user_ID)),
    conn.query(getOneUserQuery(deleteInput.user_ID)),
  ]);
}
