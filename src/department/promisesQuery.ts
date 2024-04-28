import { DatabaseService } from '../database/database.service';
import {
  getOneDepartmentQuery,
  getDepartmentByNameQuery,
} from '../database/queries/department.query';

import { CurrentUser } from '../user/user.input';

export async function updateDepartmentPromisesQuery(
  updateDepartmentInput,
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  return Promise.all([
    conn.query(getOneDepartmentQuery(updateDepartmentInput.department_ID)),
    (async () => {
      if (updateDepartmentInput.name) {
        return conn.query(
          getDepartmentByNameQuery(
            updateDepartmentInput.name,
            currentUser.Faculty_ID,
          ),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}
