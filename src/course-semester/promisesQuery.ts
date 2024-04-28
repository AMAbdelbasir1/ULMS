import { DatabaseService } from '../database/database.service';
import {
  getOneSemesterCourseQuery,
  getSemesterCourseQuery,
} from 'src/database/queries/course-semester.query';

export async function updateCourseSemesterPromisesQuery(
  updateCourseSemester: { cycle_ID: string },
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneSemesterCourseQuery(updateCourseSemester.cycle_ID)),
    conn.query(getSemesterCourseQuery(updateCourseSemester.cycle_ID)),
  ]);
}
