import { CurrentUser } from 'src/user/user.input';
import { QueryResult } from 'src/database/database.entity';

export function getQuestionsCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingQuiz, existingEnorledUser] = resultPromises;
  if (existingQuiz.recordset.length == 0) {
    throw 'QUIZ_NOT_FOUND';
  }

  if (existingEnorledUser.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
  const isRunning =
    existingQuiz.recordset[0]?.end_Date >= new Date() ||
    existingQuiz.recordset[0]?.start_Date <= new Date();

  if (currentUser.roles.includes('STUDENT') && !isRunning) {
    throw 'QUIZ_NOT_RUNNING';
  }
}

export function insertQuestionsCheckQuery(
  resultPromises: [QueryResult, QueryResult],
) {
  const [existingQuiz, existingInstructor] = resultPromises;

  if (existingQuiz.recordset.length == 0) {
    throw 'QUIZ_NOT_FOUND';
  }

  if (existingInstructor.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }

  if (existingQuiz.recordset[0].end_Date < new Date()) {
    throw 'QUIZ_ENDED';
  }
}

export function updateQuestionsCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingTask, existingInstructor] = resultPromises;

  if (existingTask.recordset.length == 0) {
    throw 'QUIZ_NOT_FOUND';
  }

  if (
    existingInstructor.recordset.length === 0 ||
    (existingTask.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function updateAnswerCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
  is_correct: number,
) {
  const [existingAnswer, existingInstructor] = resultPromises;

  if (existingAnswer.recordset.length == 0) {
    throw 'ANSWER_NOT_FOUND';
  }

  if (existingAnswer.recordset[0].is_correct === is_correct) {
    throw 'IS_TRUE';
  }

  if (
    existingInstructor.recordset.length === 0 ||
    (existingAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}


export function deleteAnswerCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingAnswer, existingInstructor] = resultPromises;

  if (existingAnswer.recordset.length == 0) {
    throw 'ANSWER_NOT_FOUND';
  }

  if (existingAnswer.recordset[0].is_correct === 1) {
    throw 'IS_TRUE_ANSWER';
  }

  if (
    existingInstructor.recordset.length === 0 ||
    (existingAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}