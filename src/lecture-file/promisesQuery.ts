import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';
import {
  getOneInstructorLectureQuery,
  getOneLectureQuery,
  getOneSemesterLectureQuery,
  getOneStudentEnrolmentLectureQuery,
} from 'src/database/queries/lecture.query';
import {
  getOneInstructorLectureFileQuery,
  getOneLectureFileQuery,
} from 'src/database/queries/lecture-file.query';

export async function getLectureFilesPromisesQuery(
  lecture_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneSemesterLectureQuery(lecture_ID)),
    conn.query(getOneLectureQuery(lecture_ID)),
    (async () => {
      if (currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneStudentEnrolmentLectureQuery(currentUser.user_ID, lecture_ID),
        );
      } else if (!currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getOneInstructorLectureQuery(currentUser.user_ID, lecture_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function uploadLectureFilePromisesQuery(
  lecture_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneLectureQuery(lecture_ID)),
    conn.query(getOneInstructorLectureQuery(instructor_ID, lecture_ID)),
    conn.query(getOneSemesterLectureQuery(lecture_ID)),
  ]);
}

export async function updateLectureFilePromisesQuery(
  lecture_file_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneLectureFileQuery(lecture_file_ID)),
    conn.query(
      getOneInstructorLectureFileQuery(instructor_ID, lecture_file_ID),
    ),
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
