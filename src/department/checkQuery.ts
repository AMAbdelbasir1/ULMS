import { QueryResult } from 'src/database/database.entity';
import { CurrentUser } from 'src/user/user.input';

export function updateDepartmentCheckQuery(
  resultCoursePromise: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingDepartment, existingNameDepartment] = resultCoursePromise;
  if (existingDepartment.recordset.length === 0) {
    throw 'DEPARTMENT_NOT_FOUND';
  }
  if (existingDepartment.recordset[0].faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }
  if (existingNameDepartment.recordset.length > 0) {
    throw 'EXISTS_DEPARTMENT';
  }
}
