import { CurrentUser } from 'src/user/user.input';
import { QueryResult } from 'src/database/database.entity';

export function getStudentsEnrolmentCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingInstructor] = resultPromises;
  if (existingCourse.recordset.length === 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingCourse.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }

  if (!currentUser.roles.includes('ADMIN')) {
    const isCurrentUserInstructor = existingInstructor.recordset.some(
      (ins) => ins.instructor_ID === currentUser.user_ID,
    );

    if (!isCurrentUserInstructor) {
      throw 'UNAUTHORIZED';
    }
  }
}

export function createStudentsEnrolmentCheckQuery(
  existingCourse: QueryResult,
  currentUser: CurrentUser,
) {
  if (existingCourse.recordset.length == 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingCourse.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }

  if (existingCourse.recordset[0].end_Date < new Date()) {
    throw 'COURSE_NOT_RUNNING';
  }
}

export function studentsEnrolmentCheckQuery(
  existingUser: [QueryResult, QueryResult][],
  currentUser: CurrentUser,
) {
  existingUser.forEach(([user, student]) => {
    const userRoles = user.recordset.map((record) => record.roles);
    const studentFound = student.recordset.length > 0;

    if (
      user.recordset.length === 0 ||
      user.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
      !userRoles.includes('STUDENT')
    ) {
      throw 'STUDENTS_NOT_FOUND';
    }

    if (studentFound) {
      throw 'STUDENT_FOUND';
    }
  });
}

export function deleteStudentsEnrolmentCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingStudent] = resultPromises;

  createStudentsEnrolmentCheckQuery(existingCourse, currentUser);

  const roles = existingStudent.recordset.some(
    (record) => record.roles == 'STUDENT',
  );

  if (
    existingStudent.recordset.length == 0 ||
    existingStudent.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
    !roles
  ) {
    throw 'STUDENT_NOT_FOUND';
  }
}
