import { DatabaseService } from 'src/database/database.service';
import {
  getOneCourseQuery,
  getCourseByNameQuery,
} from 'src/database/queries/course.query';
import { CurrentUser } from 'src/user/user.input';

export async function updateCoursePromisesQuery(
  updateCourseInput: { course_ID: string; name?: string; hours?: number },
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  const resultPromisesQuery = await Promise.all([
    conn.query(getOneCourseQuery(updateCourseInput.course_ID)),
    (async () => {
      if (updateCourseInput.name) {
        return conn.query(
          getCourseByNameQuery(updateCourseInput.name, currentUser.Faculty_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);

  return resultPromisesQuery;
}
