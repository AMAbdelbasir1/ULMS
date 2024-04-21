export function getOneTaskAnswerQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT T.instructor_ID,TA.student_ID,TA.file_path FROM task_answer TA JOIN task T ON T.task_ID=TA.task_ID
             WHERE answer_ID=@answer_ID`,
    params: { answer_ID },
  };
}

export function getTaskAnswersQuery(filterInput: {
  task_ID: string;
  page?: number;
  limit?: number;
}) {
  const offset = (filterInput.page - 1) * filterInput.limit;
  return {
    query: `SELECT TA.answer_ID ,TA.task_ID,T.title as task_name,TA.student_ID,
            U.full_name as student_name,TA.file_path ,TA.grade,TA.created_at
            FROM task_answer TA JOIN task T ON TA.task_ID=T.task_ID
            JOIN users U ON TA.student_ID=U.user_ID
            WHERE TA.task_ID=@task_ID
            ORDER BY TA.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
    params: { ...filterInput, offset },
  };
}

export function getOneTaskStudentAnswerQuery(
  task_ID: string,
  student_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT answer_ID,file_path FROM task_answer 
            WHERE task_ID=@task_ID AND student_ID=@student_ID`,
    params: { task_ID, student_ID },
  };
}

export function getStudentTaskAnswersQuery(filterInput: {
  course_cycle_ID: string;
  student_ID: string;
  page?: number;
  limit?: number;
}): {
  query: string;
  params?: any;
} {
  const offset = (filterInput.page - 1) * filterInput.limit;

  return {
    query: `SELECT TS.answer_ID,TS.task_ID,TS.grade,TS.file_path,TS.created_at,T.title as task_name 
            FROM task_answer TS 
            JOIN task T ON T.task_ID=TS.task_ID
            WHERE T.course_cycle_ID=@course_cycle_ID AND TS.student_ID=@student_ID 
            ORDER BY TS.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
    params: { ...filterInput, offset },
  };
}

export function uploadTaskAnswerQuery(uploadInput: {
  task_answer_ID: string;
  task_ID: string;
  student_ID: string;
  file_path: string;
}) {
  return {
    query: `INSERT INTO task_answer (answer_ID,task_ID,student_ID,file_path) 
            VALUES (@task_answer_ID,@task_ID,@student_ID,@file_path)`,
    params: { ...uploadInput },
  };
}

export function updateTaskAnswerQuery(updateInput: {
  task_answer_ID: string;
  file_path?: string;
  grade?: number;
}) {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'task_answer_ID' && updateInput[key],
  );
  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');
  return {
    query: `UPDATE task_answer SET ${setStatements} WHERE answer_ID=@task_answer_ID;`,
    params: { ...updateInput },
  };
}

export function getInstructorTaskAnswerQuery(
  instructor_ID: string,
  task_answer_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT TA.task_ID FROM task_answer TA JOIN task T ON T.task_ID=TA.task_ID
            join instructor_course_semester IC on T.course_cycle_ID=IC.course_cycle_ID
            WHERE TA.answer_ID=@task_answer_ID AND IC.instructor_ID=@instructor_ID`,
    params: { task_answer_ID, instructor_ID },
  };
}

export function getStudentTaskQuery(
  user_ID: string,
  task_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT task_ID FROM task T
            join student_enrolment SE on T.course_cycle_ID=SE.course_cycle_ID
            WHERE task_ID=@task_ID AND SE.student_ID=@user_ID`,
    params: { task_ID, user_ID },
  };
}

export function getCourseTasksQuery(filterInput: {
  course_cycle_ID?: string;
  instructor_ID?: string;
  page?: number;
  limit?: number;
}): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  let whereClause = '';

  if (filterInput.instructor_ID) {
    whereClause += ` AND T.instructor_ID=@instructor_ID`;
  }

  return {
    query: `SELECT T.task_ID,T.instructor_ID,U.full_name,T.course_cycle_ID,
            T.title,T.grade,T.start_Date,T.end_Date,T.file_path,T.created_at
            FROM task T 
            JOIN users U on T.instructor_ID=U.user_ID 
            WHERE T.course_cycle_ID=@course_cycle_ID ${whereClause}
            ORDER BY T.created_at DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { ...filterInput, offset },
  };
}
export function getInstructorCoursesTasksQuery(filterInput: {
  user_ID: string;
  instructor_ID?: string;
  page?: number;
  limit?: number;
}): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  const params = { ...filterInput, offset, user_ID: filterInput.user_ID };
  let query = `SELECT T.task_ID,T.instructor_ID,U.full_name,T.course_cycle_ID,CS.name,
              T.title,T.grade,T.start_Date,T.end_Date,T.file_path,T.created_at
              FROM task T 
              JOIN instructor_course_semester IC on T.course_cycle_ID=IC.course_cycle_ID
              JOIN course_semester CS on IC.course_cycle_ID=CS.course_cycle_ID
              JOIN users U on IC.instructor_ID=U.user_ID `;
  if (filterInput.instructor_ID) {
    query += ` AND T.instructor_ID=@instructor_ID`;
  }
  query += ` WHERE IC.instructor_ID=@user_ID ORDER BY T.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  return { query, params };
}

export function getStudentCoursesTasksQuery(filterInput: {
  user_ID: string;
  instructor_ID?: string;
  page?: number;
  limit?: number;
}): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  const params = { ...filterInput, offset, user_ID: filterInput.user_ID };
  let query = `SELECT T.task_ID,T.instructor_ID,U.full_name,T.course_cycle_ID,CS.name,
              T.title,T.grade,T.start_Date,T.end_Date,T.file_path,T.created_at
              FROM task T 
              JOIN student_enrolment SE on T.course_cycle_ID=SE.course_cycle_ID
              JOIN course_semester CS on SE.course_cycle_ID=CS.course_cycle_ID
              JOIN users U on SE.student_ID=U.user_ID `;
  if (filterInput.instructor_ID) {
    query += ` AND T.instructor_ID=@instructor_ID`;
  }
  query += ` WHERE SE.student_ID=@user_ID ORDER BY T.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  return { query, params };
}

export function insertTaskQuery(taskInput: {
  task_ID: string;
  course_cycle_ID: string;
  title: string;
  grade: number;
  start_Date: string;
  end_Date: string;
  file_path: string;
  instructor_ID: string;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO task (task_ID,course_cycle_ID,title,grade,start_Date,end_Date,file_path,instructor_ID) 
            VALUES (@task_ID,@course_cycle_ID,@title,@grade,@start_Date,@end_Date,@file_path,@instructor_ID)`,
    params: { ...taskInput },
  };
}

export function updateTaskQuery(updateInput: {
  task_ID: string;
  course_cycle_ID?: string;
  title?: string;
  grade?: number;
  start_Date?: string;
  end_Date?: string;
  file_path?: string;
}): { query: string; params?: any } {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'task_ID' && updateInput[key],
  );

  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');

  return {
    query: `UPDATE task SET ${setStatements} WHERE task_ID=@task_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneTaskAnswerQuery(task_answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM task_answer WHERE answer_ID=@task_answer_ID;`,
    params: { task_answer_ID },
  };
}
