export function getOneTaskQuery(task_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT task_ID,instructor_ID,start_Date,end_Date,file_path FROM task WHERE task_ID=@task_ID`,
    params: { task_ID },
  };
}
export function getInstructorTaskQuery(
  instructor_ID: string,
  task_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT task_ID FROM task T
            join instructor_course_semester IC on T.course_cycle_ID=IC.course_cycle_ID
            WHERE task_ID=@task_ID AND IC.instructor_ID=@instructor_ID`,
    params: { task_ID, instructor_ID },
  };
}

export function getSemesterTaskQuery(task_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT S.start_Date,S.end_Date FROM task T 
            JOIN course_semester CS ON T.course_cycle_ID=CS.cycle_ID
            JOIN semester S ON CS.semester_ID=S.semester_ID
            WHERE task_ID=@task_ID`,
    params: { task_ID },
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
  let query = `SELECT T.task_ID,T.instructor_ID,U.full_name,T.course_cycle_ID,C.name,
              T.title,T.grade,T.start_Date,T.end_Date,T.file_path,T.created_at
              FROM task T 
              JOIN instructor_course_semester IC on T.course_cycle_ID=IC.course_cycle_ID
              JOIN course_semester CS on IC.course_cycle_ID=CS.cycle_ID
              JOIN course C on CS.Course_ID=C.Course_ID
              JOIN users U on T.instructor_ID=U.user_ID `;
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
  let query = `SELECT T.task_ID,T.instructor_ID,U.full_name,T.course_cycle_ID,C.name,
              T.title,T.grade,T.start_Date,T.end_Date,T.file_path,T.created_at
              FROM task T 
              JOIN student_enrolment SE on T.course_cycle_ID=SE.course_cycle_ID
              JOIN course_semester CS on SE.course_cycle_ID=CS.cycle_ID
              JOIN course C on CS.Course_ID=C.Course_ID
              JOIN semester S on CS.semester_ID=S.semester_ID
              JOIN users U on T.instructor_ID=U.user_ID `;
  if (filterInput.instructor_ID) {
    query += ` AND T.instructor_ID=@instructor_ID`;
  }
  query += ` WHERE SE.student_ID=@user_ID AND S.end_Date>=GETDATE() AND S.start_Date<=GETDATE() 
             ORDER BY T.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
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

export function deleteOneTaskQuery(task_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM task WHERE task_ID=@task_ID;`,
    params: { task_ID },
  };
}
