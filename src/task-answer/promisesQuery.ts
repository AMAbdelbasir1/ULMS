import { DatabaseService } from 'src/database/database.service';

import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import { getOneStudentEnrolmentQuery } from 'src/database/queries/student-enrolment.query';
import {
  getInstructorTaskQuery,
  getOneTaskQuery,
  getStudentTaskQuery,
} from 'src/database/queries/task.query';
import {
  getInstructorTaskAnswerQuery,
  getOneTaskAnswerQuery,
  getOneTaskStudentAnswerQuery,
} from 'src/database/queries/task-answer.query';
import { CurrentUser } from 'src/user/user.input';

export async function getTaskAnswersPromisesQuery(
  task_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneTaskQuery(task_ID)),
    conn.query(getInstructorTaskQuery(instructor_ID, task_ID)),
  ]);
}

export async function getStudentTaskAnswersPromisesQuery(
  course_cycle_ID: string,
  student_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getSemesterCourseQuery(course_cycle_ID)),
    conn.query(getOneStudentEnrolmentQuery(student_ID, course_cycle_ID)),
  ]);
}

export async function uploadTaskAnswerPromisesQuery(
  task_ID: string,
  student_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneTaskQuery(task_ID)),
    conn.query(getStudentTaskQuery(student_ID, task_ID)),
    conn.query(getOneTaskStudentAnswerQuery(task_ID, student_ID)),
  ]);
}

export async function updateTaskAnswerPromisesQuery(
  task_answer_ID: string,
  instructor_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneTaskAnswerQuery(task_answer_ID)),
    conn.query(getInstructorTaskAnswerQuery(instructor_ID, task_answer_ID)),
  ]);
}

export async function deleteTaskAnswerPromisesQuery(
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
  ]);
}
