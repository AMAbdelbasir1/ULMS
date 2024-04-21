import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';

import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import { getOneInstructorCourseQuery } from 'src/database/queries/instructor-course.query';
import { getOneStudentEnrolmentQuery } from 'src/database/queries/student-enrolment.query';

import {
  getInstructorQuizQuery,
  getOneQuizQuery,
} from 'src/database/queries/quiz.query';
import { getLastSemeterQuery } from 'src/database/queries/semester.query';

export async function getQuizzesPromisesQuery(
  course_cycle_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  const isStudent = currentUser.roles.includes('STUDENT');
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    (async () => {
      if (isStudent) {
        return conn.query(
          getOneStudentEnrolmentQuery(currentUser.user_ID, course_cycle_ID),
        );
      } else if (!isStudent) {
        return conn.query(
          getOneInstructorCourseQuery(currentUser.user_ID, course_cycle_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function creatQuizPromisesQuery(
  course_cycle_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneInstructorCourseQuery(instructor_ID, course_cycle_ID)),
  ]);
}

export async function updateQuizPromisesQuery(
  quiz_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneQuizQuery(quiz_ID)),
    conn.query(getInstructorQuizQuery(currentUser.user_ID, quiz_ID)),
    conn.query(getLastSemeterQuery(currentUser.Faculty_ID)),
  ]);
}
