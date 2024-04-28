import { DatabaseService } from '../database/database.service';
import { getSemesterCourseQuery } from '../database/queries/course-semester.query';

import { getOneStudentEnrolmentQuery } from '../database/queries/student-enrolment.query';
import { getOneUserWithRoleQuery } from '../database/queries/user.query';
import { CurrentUser } from '../user/user.input';
import { DeleteInstructorCourseInput } from './instructors-course.input';
import { getOneInstructorCourseQuery } from '../database/queries/instructor-course.query';

export async function getInstructorsCoursePromisesQuery(
  course_cycle_ID: string,
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    (async () => {
      if (currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneStudentEnrolmentQuery(currentUser.user_ID, course_cycle_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function createInstructorsCoursePromisesQuery(
  instructorsCourseInput,
  conn: DatabaseService,
) {
  return Promise.all([
    Promise.all(
      instructorsCourseInput.instructors_ID.map((instructor) =>
        Promise.all([
          conn.query(getOneUserWithRoleQuery(instructor)),
          conn.query(
            getOneInstructorCourseQuery(
              instructor,
              instructorsCourseInput.course_cycle_ID,
            ),
          ),
        ]),
      ),
    ),
  ]);
}

export async function deleteInstructorCoursePromisesQuery(
  deleteStudentEnrolmentInput: DeleteInstructorCourseInput,
  conn: DatabaseService,
) {
  const { instructor_ID, course_cycle_ID } = deleteStudentEnrolmentInput;
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneUserWithRoleQuery(instructor_ID)),
    // conn.query(getOneInstructorCourseQuery(instructor_ID, course_cycle_ID)),
  ]);
}
