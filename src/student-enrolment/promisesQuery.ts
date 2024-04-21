import { DatabaseService } from 'src/database/database.service';
import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import { getInstructorsCourseQuery } from 'src/database/queries/instructor-course.query';
import { getOneStudentEnrolmentQuery } from 'src/database/queries/student-enrolment.query';
import { getOneUserWithRoleQuery } from 'src/database/queries/user.query';
import { CurrentUser } from 'src/user/user.input';
import { StudentEnrolmentInput } from './student-enrolment.input';

export async function getStudentsEnrolmentPromisesQuery(
  course_cycle_ID: string,
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    (async () => {
      if (!currentUser.roles.includes('ADMIN')) {
        return conn.query(getInstructorsCourseQuery(course_cycle_ID));
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function createStudentsEnrolmentPromisesQuery(
  studentEnrolmentInput: StudentEnrolmentInput,
  conn: DatabaseService,
) {
  return Promise.all([
    Promise.all(
      studentEnrolmentInput.students_ID.map((student) =>
        Promise.all([
          conn.query(getOneUserWithRoleQuery(student)),
          conn.query(
            getOneStudentEnrolmentQuery(
              student,
              studentEnrolmentInput.course_cycle_ID,
            ),
          ),
        ]),
      ),
    ),
  ]);
}
export async function deleteStudentsEnrolmentPromisesQuery(
  deleteStudentEnrolmentInput,
  conn: DatabaseService,
) {
  const { student_ID, course_cycle_ID } = deleteStudentEnrolmentInput;
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneUserWithRoleQuery(student_ID)),
    conn.query(getOneStudentEnrolmentQuery(student_ID, course_cycle_ID)),
  ]);
}
