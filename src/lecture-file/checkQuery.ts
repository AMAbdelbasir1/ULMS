import { CurrentUser } from '../user/user.input';
import { QueryResult } from '../database/database.entity';

export function getLectureFilesCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingSemester, existingLecture, existingEnorledUser] =
    resultPromises;
  if (existingLecture.recordset.length == 0) {
    throw 'LECTURE_NOT_FOUND';
  }

  if (existingEnorledUser.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
  const isRunning =
    existingSemester.recordset[0].end_Date >= new Date() ||
    existingSemester.recordset[0].start_Date <= new Date();

  // console.log(isRunning);

  if (currentUser.roles.includes('STUDENT') && !isRunning) {
    throw 'CYCLE_NOT_RUNNING';
  }
}

export function uploadLectureFileCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingLecture, existingSemester, existingInstructor] =
    resultPromises;

  if (existingLecture.recordset.length == 0) {
    throw 'LECTURE_NOT_FOUND';
  }

  if (
    existingInstructor.recordset.length === 0 ||
    (existingLecture.recordset[0].type == 'Lecture' &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }

  if (existingSemester.recordset[0].end_Date < new Date()) {
    throw 'CYCLE_ENDED';
  }
}

export function updateLectureFileCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingLecture, existingInstructor] = resultPromises;

  if (existingLecture.recordset.length == 0) {
    throw 'LECTURE_NOT_FOUND';
  }
  if (
    existingInstructor.recordset.length === 0 ||
    (existingLecture.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}
