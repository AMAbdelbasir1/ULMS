import { CurrentUser } from '../user/user.input';
import { QueryResult } from '../database/database.entity';

export function getLecturesCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingEnorledUser] = resultPromises;
  if (existingCourse.recordset.length === 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (
    existingCourse.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
    existingEnorledUser.recordset.length == 0
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function createLectureCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingCourse, existingInstructor] = resultPromises;

  if (existingCourse.recordset.length == 0) {
    throw 'CYCLE_NOT_FOUND';
  }

  if (
    existingCourse.recordset[0].Faculty_ID !== currentUser.Faculty_ID ||
    existingInstructor.recordset.length === 0
  ) {
    throw 'UNAUTHORIZED';
  }

  if (existingCourse.recordset[0].end_Date < new Date()) {
    throw 'CYCLE_ENDED';
  }
}

export function updateLectureCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingLecture, existingInstructor] = resultPromises;

  if (existingLecture.recordset.length == 0) {
    throw 'LECTURE_NOT_FOUND';
  }
  console.log(existingLecture.recordset[0].instructor_ID, currentUser.user_ID);
  if (
    existingInstructor.recordset.length === 0 ||
    (existingLecture.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}

// export function deleteInstructorCourseCheckQuery(
//   resultPromises: [QueryResult, QueryResult],
//   currentUser: CurrentUser,
// ) {

// }
