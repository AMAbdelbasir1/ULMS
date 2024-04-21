import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';
import {
  getOneInstructorLectureFileQuery,
  getOneLectureFileQuery,
  getOneStudentEnrollmentLectureFileQuery,
} from 'src/database/queries/lecture-file.query';
import {
  getInstructorTaskQuery,
  getOneTaskQuery,
  getStudentTaskQuery,
} from 'src/database/queries/task.query';

export async function getLectureFilePromisesQuery(
  lecture_File_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneLectureFileQuery(lecture_File_ID)),
    (async () => {
      if (currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneStudentEnrollmentLectureFileQuery(
            currentUser.user_ID,
            lecture_File_ID,
          ),
        );
      } else if (!currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneInstructorLectureFileQuery(
            currentUser.user_ID,
            lecture_File_ID,
          ),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function getTaskFilePromisesQuery(
  task_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  const isStudent = currentUser.roles.includes('STUDENT');
  return Promise.all([
    conn.query(getOneTaskQuery(task_ID)),
    (async () => {
      if (isStudent) {
        return conn.query(getStudentTaskQuery(currentUser.user_ID, task_ID));
      } else if (!isStudent) {
        return conn.query(getInstructorTaskQuery(currentUser.user_ID, task_ID));
      }
      return { recordset: [] };
    })(),
  ]);
}
