import { CurrentUser } from '../user/user.input';
import { QueryResult } from '../database/database.entity';

export function getStudentTaskAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult],
) {
  const [existingCourse, existingEnorledSudent] = resultPromises;
  if (existingCourse.recordset.length == 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingEnorledSudent.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
  const isRunning =
    existingCourse.recordset[0].end_Date >= new Date() ||
    existingCourse.recordset[0].start_Date <= new Date();

  if (!isRunning) {
    throw 'CYCLE_NOT_RUNNING';
  }
}

export function getTaskAnswersCheckQuery(
  resultPromises: [QueryResult, QueryResult],
) {
  const [existingTask, existingInstructor] = resultPromises;
  if (existingTask.recordset.length == 0) {
    throw 'TASK_NOT_FOUND';
  }

  if (existingInstructor.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }
}

export function uploadTaskAnswerCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
) {
  const [existingTask, existingStudent] = resultPromises;

  if (existingTask.recordset.length == 0) {
    throw 'TASK_NOT_FOUND';
  }

  if (existingStudent.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }

  if (existingTask.recordset[0].end_Date < new Date()) {
    throw 'TASK_ENDED';
  }

  if (existingTask.recordset[0].start_Date > new Date()) {
    throw 'TASK_NOT_RUNNING';
  }
}

export function updateTaskAnswerCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingTaskAnswer, existingInstructor] = resultPromises;

  if (existingTaskAnswer.recordset.length == 0) {
    throw 'TASK_ANSWER_NOT_FOUND';
  }
  if (
    existingInstructor.recordset.length === 0 ||
    (existingTaskAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}

export function deleteTaskAnswerCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
) {
  const [existingTaskAnswer, existingInstructor] = resultPromises;
  if (existingTaskAnswer.recordset.length == 0) {
    throw 'TASK_ANSWER_NOT_FOUND';
  }

  if (currentUser.roles.includes('STUDENT')) {
    if (existingTaskAnswer.recordset[0].student_ID !== currentUser.user_ID) {
      throw 'UNAUTHORIZED';
    }
  }

  if (
    existingInstructor.recordset.length === 0 ||
    (existingTaskAnswer.recordset[0].instructor_ID !== currentUser.user_ID &&
      !currentUser.roles.includes('DOCTOR'))
  ) {
    throw 'UNAUTHORIZED';
  }
}
