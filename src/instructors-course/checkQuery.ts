import { CurrentUser } from 'src/user/user.input';
import { QueryResult } from 'src/database/database.entity';

export function getInstructorsCourseCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingStudent] = resultPromises;
  if (existingCourse.recordset.length === 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingCourse.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }

  if (
    currentUser.roles.includes('STUDENT') &&
    existingStudent.recordset.length == 0
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function createInstructorsCourseCheckQuery(
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

export function deleteInstructorCourseCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingInstructor] = resultPromises;

  createInstructorsCourseCheckQuery(existingCourse, currentUser);

  const roles = existingInstructor.recordset.some(
    (record) => record.roles == 'DOCTOR' || record.roles == 'ASSISTANT',
  );

  if (
    existingInstructor.recordset.length == 0 ||
    existingInstructor.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
    !roles
  ) {
    throw 'INSTRUCTORS_NOT_FOUND';
  }
}

export function instructorsCourseCheckQuery(
  existingUser: [QueryResult, QueryResult][],
  currentUser: CurrentUser,
) {
  existingUser.forEach(([user, instructor]) => {
    const userRoles = user.recordset.map((record) => record.roles);
    const instructorFound = instructor.recordset.length > 0;

    if (
      user.recordset.length === 0 ||
      user.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
      (!userRoles.includes('DOCTOR') && !userRoles.includes('ASSISTANT'))
    ) {
      throw 'INSTRUCTORS_NOT_FOUND';
    }

    if (instructorFound) {
      throw 'INSTRUCTOR_FOUND';
    }
  });
}
