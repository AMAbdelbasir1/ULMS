import { QueryResult } from 'src/database/database.entity';
import { CurrentUser } from 'src/user/user.input';

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
    existingTask.recordset[0].start_Date < new Date() ||
    existingTask.recordset[0].end_Date > new Date();
  if (currentUser.roles.includes('STUDENT') && !taskAvilable) {
    {
      throw 'FILE_NOT_AVAILABLE';
    }
  }
}
