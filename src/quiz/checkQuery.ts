import { CurrentUser } from 'src/user/user.input';
import { QueryResult } from 'src/database/database.entity';

export function getQuizzesCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  currentUser: CurrentUser,
  course_cycle_ID: string,
) {
  const [existingCourse, existingEnorledUser] = resultPromises;
  if (existingCourse.recordset.length == 0 && course_cycle_ID) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingEnorledUser.recordset.length === 0 && course_cycle_ID) {
    throw 'UNAUTHORIZED';
  }
  const isRunning =
    existingCourse.recordset[0]?.end_Date >= new Date() ||
    existingCourse.recordset[0]?.start_Date <= new Date();

  if (currentUser.roles.includes('STUDENT') && !isRunning && course_cycle_ID) {
    throw 'CYCLE_NOT_RUNNING';
  }
}

export function createQuizCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  scheduleDate: {
    start_Date: Date;
    end_Date: Date;
  },
) {
  const [existingCourse, existingInstructor] = resultPromises;

  if (existingCourse.recordset.length == 0) {
    throw 'COURSE_NOT_FOUND';
  }

  if (existingInstructor.recordset.length === 0) {
    throw 'UNAUTHORIZED';
  }

  if (existingCourse.recordset[0].end_Date < new Date()) {
    throw 'CYCLE_ENDED';
  }

  if (existingCourse.recordset[0].start_Date > new Date()) {
    throw 'CYCLE_NOT_RUNNING';
  }

  const inValidDate =
    scheduleDate.end_Date < scheduleDate.start_Date ||
    scheduleDate.end_Date > existingCourse.recordset[0].end_Date ||
    scheduleDate.start_Date < existingCourse.recordset[0].start_Date ||
    scheduleDate.start_Date > existingInstructor.recordset[0].end_Date;

  if (inValidDate) {
    throw 'INVALID_DATE';
  }
}

export function updateQuizCheckQuery(
  resultPromises: [QueryResult, QueryResult, QueryResult],
  currentUser: CurrentUser,
  scheduleDate: {
    start_Date: Date;
    end_Date: Date;
  },
) {
  const [existingTask, existingInstructor, semesterQuiz] = resultPromises;

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

  if (
    semesterQuiz.recordset[0].end_Date < new Date() ||
    semesterQuiz.recordset[0].start_Date > new Date()
  ) {
    throw 'CYCLE_NOT_RUNNING';
  }

  const inValidDate =
    (scheduleDate.end_Date ? [scheduleDate.end_Date] : []).some(
      (date) =>
        date < (scheduleDate.start_Date ? [scheduleDate.start_Date] : [])[0] ||
        date > semesterQuiz.recordset[0].end_Date,
    ) ||
    (scheduleDate.start_Date ? [scheduleDate.start_Date] : []).some(
      (date) =>
        date < semesterQuiz.recordset[0].start_Date ||
        date > semesterQuiz.recordset[0].end_Date,
    );

  if (inValidDate) {
    throw 'INVALID_DATE';
  }
}
