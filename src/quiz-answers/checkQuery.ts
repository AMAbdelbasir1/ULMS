import { CurrentUser } from 'src/user/user.input';
import { QueryResult } from 'src/database/database.entity';

export function getQuizAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingQuiz, existingInstructor] = resultPromises;
  if (existingQuiz.recordset.length == 0) {
    throw 'QUIZ_NOT_FOUND';
  }

  if (
    (existingInstructor.recordset.length === 0 &&
      existingQuiz.recordset[0].instructor_ID !== currentUser.user_ID) ||
    !currentUser.roles.includes('DOCTOR')
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function getQuizStudentAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingSubmit, existingInstructor] = resultPromises;
  if (existingSubmit.recordset.length == 0) {
    throw 'STUDENT_SUBMIT_NOT_FOUND';
  }

  if (
    currentUser.roles.includes('STUDENT') &&
    existingSubmit.recordset[0].student_ID !== currentUser.user_ID
  ) {
    throw 'UNAUTHORIZED';
  }

  if (
    (!currentUser.roles.includes('STUDENT') &&
      existingInstructor.recordset.length === 0) ||
    !currentUser.roles.includes('DOCTOR')
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function getQuizzesStudentSubmitCheckQuery(
  resultPromises: [QueryResult, QueryResult],
) {
  const [existingCourse, existingStudent] = resultPromises;
  if (existingCourse.recordset.length == 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingStudent.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
  const isRunning =
    existingCourse.recordset[0]?.end_Date >= new Date() ||
    existingCourse.recordset[0]?.start_Date <= new Date();

  if (!isRunning) {
    throw 'CYCLE_NOT_RUNNING';
  }
}

export function submitQuizAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
) {
  const [existingQuiz, existingStudent, existingSubmit] = resultPromises;

  if (existingQuiz.recordset.length == 0) {
    throw 'QUIZ_NOT_FOUND';
  }

  if (existingStudent.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }

  if (existingSubmit.recordset.length > 0) {
    throw 'ALREADY_SUBMIT';
  }

  if (existingQuiz.recordset[0].end_Date < new Date()) {
    throw 'QUIZ_ENDED';
  }

  if (existingQuiz.recordset[0].start_Date > new Date()) {
    throw 'QUIZ_NOT_RUNNING';
  }
}

export function checkQuestionsAndAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult][],
  quiz_ID: string,
) {
  let hasAnswer = false;
  resultPromises.map(([existingQuestion, existingAnswer]) => {
    if (existingQuestion.recordset.length === 0) {
      throw 'QUESTION_NOT_FOUND';
    }

    console.log(existingQuestion.recordset[0].quiz_ID, quiz_ID);
    if (existingQuestion.recordset[0].quiz_ID !== quiz_ID) {
      throw 'INVALID_DATA';
    }

    if (existingAnswer.recordset.length === 0) {
      throw 'ANSWER_NOT_FOUND';
    }
    if (
      existingAnswer.recordset[0].question_ID !==
      existingQuestion.recordset[0].question_ID
    ) {
      throw 'INVALID_DATA';
    }
    if (existingAnswer.recordset[0].type == 'answer') {
      hasAnswer = true;
    }
  });
  return hasAnswer;
}

export function updateQuizAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult][],
  currentUser: CurrentUser,
) {
  const isDoctor = currentUser.roles.includes('DOCTOR');
  let quiz_ID: string = null;
  resultPromises.map(([existingAnswer, existingInstructor]) => {
    if (existingAnswer.recordset.length == 0) {
      throw 'ANSWER_NOT_FOUND';
    }
    if (!quiz_ID) {
      quiz_ID = existingAnswer.recordset[0].quiz_ID as string;
    }

    if (quiz_ID !== existingAnswer.recordset[0].quiz_ID) {
      throw 'ANSWERS_NOT_SAME_QUIZ';
    }

    if (
      existingInstructor.recordset.length === 0 ||
      (existingAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
        !isDoctor)
    ) {
      throw 'UNAUTHORIZED';
    }
    if (
      existingInstructor.recordset.length === 0 ||
      (existingAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
        !isDoctor)
    ) {
      throw 'UNAUTHORIZED';
    }

    if (existingAnswer.recordset[0].type === 'answer') {
      throw 'ONLY_ESSAY_ANSWER_ALLOWED';
    }
  });
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
