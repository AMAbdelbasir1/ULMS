import { QueryResult } from '../database/database.entity';
import { CurrentUser } from '../user/user.input';

export function getLectureFileCheckQuery(
  resultPromises: [QueryResult, QueryResult],
) {
  const [existingLectureFile, existingEnorledUser] = resultPromises;
  if (existingLectureFile.recordset.length == 0) {
    throw 'FILE_NOT_FOUND';
  }

  if (existingEnorledUser.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
}

export function getTaskFileCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingTask, existingEnorledUser] = resultPromises;
  if (existingTask.recordset.length == 0) {
    throw 'FILE_NOT_FOUND';
  }

  if (existingEnorledUser.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
  const taskAvilable =
    existingTask.recordset[0].start_Date < new Date() &&
    existingTask.recordset[0].end_Date > new Date();

  if (currentUser.roles.includes('STUDENT') && !taskAvilable) {
    {
      throw 'FILE_NOT_AVAILABLE';
    }
  }
}

export function getTaskAnswerFileCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingTask, existingUser, lastestSemester] = resultPromises;
  if (existingTask.recordset.length == 0) {
    throw 'FILE_NOT_FOUND';
  }
  const isStudent = currentUser.roles.includes('STUDENT');
  if (existingUser.recordset.length == 0 && !isStudent) {
    throw 'UNAUTHORIZED';
  }

  if (
    isStudent &&
    existingTask.recordset[0].student_ID !== currentUser.user_ID
  ) {
    throw 'UNAUTHORIZED';
  }

  const taskAvilable =
    lastestSemester.recordset[0].start_Date < new Date() ||
    lastestSemester.recordset[0].end_Date > new Date();
  if (currentUser.roles.includes('STUDENT') && !taskAvilable) {
    {
      throw 'FILE_NOT_AVAILABLE';
    }
  }
}
