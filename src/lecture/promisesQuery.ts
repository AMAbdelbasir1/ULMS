import { DatabaseService } from 'src/database/database.service';
import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import { getOneInstructorCourseQuery } from 'src/database/queries/instructor-course.query';
import { CurrentUser } from 'src/user/user.input';
import { getOneStudentEnrolmentQuery } from 'src/database/queries/student-enrolment.query';
import {
  getOneInstructorLectureQuery,
  getOneLectureQuery,
} from 'src/database/queries/lecture.query';

export async function getLecturesPromisesQuery(
  course_cycle_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    (async () => {
      if (currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneStudentEnrolmentQuery(currentUser.user_ID, course_cycle_ID),
        );
      } else if (
        currentUser.roles.includes('DOCTOR') ||
        currentUser.roles.includes('ASSISTANT')
      ) {
        return conn.query(
          getOneInstructorCourseQuery(currentUser.user_ID, course_cycle_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function createLecturesCoursePromisesQuery(
  course_cycle_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneInstructorCourseQuery(instructor_ID, course_cycle_ID)),
  ]);
}

export async function updateLecturePromisesQuery(
  lecture_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneLectureQuery(lecture_ID)),
    conn.query(getOneInstructorLectureQuery(instructor_ID, lecture_ID)),
  ]);
}

// export async function deleteLecturePromisesQuery(
//   deleteLectureInput,
//   conn: DatabaseService,
// ) {
//   const { instructor_ID, lecture_ID } = deleteLectureInput;
//   return Promise.all([
//     conn.query(getOneLectureQuery(lecture_ID)),
//     conn.query(getOneInstructorLectureQuery(instructor_ID, lecture_ID)),
//   ]);
// }
