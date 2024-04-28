import { DatabaseService } from '../database/database.service';
import { CurrentUser } from '../user/user.input';
import {
  getOneInstructorLectureFileQuery,
  getOneLectureFileQuery,
  getOneStudentEnrollmentLectureFileQuery,
} from '../database/queries/lecture-file.query';
import {
  getInstructorTaskQuery,
  getOneTaskQuery,
  getStudentTaskQuery,
} from '../database/queries/task.query';
import {
  getInstructorTaskAnswerQuery,
  getOneTaskAnswerQuery,
} from '../database/queries/task-answer.query';
import { getLastSemeterQuery } from '../database/queries/semester.query';

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

export async function getTaskAnswerFilePromisesQuery(
  task_answer_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneTaskAnswerQuery(task_answer_ID)),
    (async () => {
      if (!currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getInstructorTaskAnswerQuery(currentUser.user_ID, task_answer_ID),
        );
      }
      return { recordset: [] };
    })(),

    conn.query(getLastSemeterQuery(currentUser.Faculty_ID)),
  ]);
}
