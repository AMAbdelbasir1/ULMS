import { QueryResult } from 'src/database/database.entity';
import { CurrentUser } from 'src/user/user.input';

export function updateCourseCheckQuery(
  resultCoursePromise: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingNameCourse] = resultCoursePromise;
  if (existingCourse.recordset.length === 0) {
    throw 'COURSE_NOT_FOUND';
  }
  if (existingCourse.recordset[0].faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }
  if (existingNameCourse.recordset.length > 0) {
    throw 'EXISITS_COURSE';
  }
}
