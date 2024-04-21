import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';

import {
  getInstructorQuizQuery,
  getOneQuizQuery,
  getStudentQuizQuery,
} from 'src/database/queries/quiz.query';
import {
  getInstructorQuestionQuery,
  getOneAnswerQuery,
  getOneInstructorQuestionAnswerQuery,
  getOneQuestionQuery,
} from 'src/database/queries/question&answers.query';

export async function getQuestionsPromisesQuery(
  quiz_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  const isStudent = currentUser.roles.includes('STUDENT');
  return Promise.all([
    conn.query(getOneQuizQuery(quiz_ID)),
    (async () => {
      if (isStudent) {
        return conn.query(getStudentQuizQuery(currentUser.user_ID, quiz_ID));
      } else if (!isStudent) {
        return conn.query(getInstructorQuizQuery(currentUser.user_ID, quiz_ID));
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function insertQuestionsPromisesQuery(
  quiz_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneQuizQuery(quiz_ID)),
    conn.query(getInstructorQuizQuery(instructor_ID, quiz_ID)),
  ]);
}

export async function updateQuestionsPromisesQuery(
  question_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneQuestionQuery(question_ID)),
    conn.query(getInstructorQuestionQuery(instructor_ID, question_ID)),
  ]);
}

export async function updateAnswerPromisesQuery(
  answer_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneAnswerQuery(answer_ID)),
    conn.query(getOneInstructorQuestionAnswerQuery(instructor_ID, answer_ID)),
  ]);
}
