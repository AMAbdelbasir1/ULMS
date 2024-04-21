import { DatabaseService } from 'src/database/database.service';

import {
  getInstructorQuizQuery,
  getOneQuizQuery,
  getStudentQuizQuery,
} from 'src/database/queries/quiz.query';
import {
  getOneAnswerQuery,
  getOneInstructorQuestionAnswerQuery,
  getOneQuestionQuery,
} from 'src/database/queries/question&answers.query';
import { QuizAnswerUpdateInput } from './quiz-answers.input';
import {
  getInstructorSubmitQuery,
  getOneInstructorQuizAnswerQuery,
  getOneStudentQuizAnswerQuery,
  getOneStudentSubmitQuery,
  getOneSubmitQuery,
} from 'src/database/queries/quiz_answers.query';
import { CurrentUser } from 'src/user/user.input';
import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import { getOneStudentEnrolmentQuery } from 'src/database/queries/student-enrolment.query';

export async function getQuizAnswersPromisesQuery(
  quiz_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneQuizQuery(quiz_ID)),
    conn.query(getInstructorQuizQuery(instructor_ID, quiz_ID)),
  ]);
}

export async function getQuizStudentAnswersPromisesQuery(
  submit_ID: string,
  currentUser: CurrentUser,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneSubmitQuery(submit_ID)),
    (async () => {
      if (!currentUser.roles.includes('STUDENT')) {
        return conn.query(
          getInstructorSubmitQuery(currentUser.user_ID, submit_ID),
        );
      }
      return { recordset: [] };
    })(),
  ]);
}

export async function getQuizzesStudentSubmitPromisesQuery(
  course_cycle_ID: string,
  student_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneStudentEnrolmentQuery(student_ID, course_cycle_ID)),
  ]);
}
export async function submitQuizAnswersPromisesQuery(
  quiz_ID: string,
  student_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneQuizQuery(quiz_ID)),
    conn.query(getStudentQuizQuery(student_ID, quiz_ID)),
    conn.query(getOneStudentSubmitQuery(student_ID, quiz_ID)),
  ]);
}

export async function checkQuestionsAndAnswersPromisesQuery(
  questionAndAnswers: {
    question_ID: string;
    answer_ID?: string;
    text?: string;
  }[],
  conn: DatabaseService,
) {
  return Promise.all([
    // Promise.all(
    ...questionAndAnswers.map(
      ({ question_ID, answer_ID, text }) =>
        Promise.all([
          conn.query(getOneQuestionQuery(question_ID)),
          (async () => {
            if (answer_ID) {
              return conn.query(getOneAnswerQuery(answer_ID));
            }
            return { recordset: [{ text: text }] };
          })(),
        ]),
      // ),
    ),
  ]);
}
export async function updateQuizAnswersPromisesQuery(
  quizAnswerUpdateInput: QuizAnswerUpdateInput[],
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...quizAnswerUpdateInput.map(({ answer_ID, grade }) =>
      Promise.all([
        conn.query(getOneStudentQuizAnswerQuery(answer_ID)),
        conn.query(getOneInstructorQuizAnswerQuery(instructor_ID, answer_ID)),
      ]),
    ),
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
