export function getOneQuizQuery(quiz_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM quiz WHERE quiz_ID=@quiz_ID`,
    params: { quiz_ID },
  };
}
export function getInstructorQuizQuery(
  instructor_ID: string,
  quiz_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT quiz_ID FROM quiz q
            join instructor_course_semester IC on q.course_cycle_ID=IC.course_cycle_ID
            WHERE quiz_ID=@quiz_ID AND IC.instructor_ID=@instructor_ID`,
    params: { quiz_ID, instructor_ID },
  };
}

export function getStudentQuizQuery(
  user_ID: string,
  quiz_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT quiz_ID FROM quiz q
            join student_enrolment SE on q.course_cycle_ID=SE.course_cycle_ID
            WHERE quiz_ID=@quiz_ID AND SE.student_ID=@user_ID`,
    params: { quiz_ID, user_ID },
  };
}

export function getSemesterQuizQuery(quiz_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT S.start_Date,S.end_Date FROM quiz q
            JOIN course_semester CS on q.course_cycle_ID=CS.cycle_ID
            JOIN semester S on CS.semester_ID=S.semester_ID
            WHERE quiz_ID=@quiz_ID`,
    params: { quiz_ID },
  };
}

export function getCourseQuizzesQuery(filterInput: {
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
    query: `SELECT q.quiz_ID,q.instructor_ID,U.full_name
            q.title,q.grade,q.start_Date,q.end_Date,q.created_at
            FROM quiz q 
            JOIN users U on q.instructor_ID=U.user_ID 
            WHERE T.course_cycle_ID=@course_cycle_ID ${whereClause}
            ORDER BY q.created_at DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { ...filterInput, offset },
  };
}
export function getInstructorCoursesQuizzesQuery(filterInput: {
  user_ID: string;
  instructor_ID?: string;
  page?: number;
  limit?: number;
}): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  const params = { ...filterInput, offset, user_ID: filterInput.user_ID };
  let query = `SELECT q.quiz_ID,q.instructor_ID,U.full_name,q.course_cycle_ID,C.name,
              q.title,q.notes,q.grade,q.start_Date,q.end_Date,q.created_at
              FROM quiz q 
              JOIN instructor_course_semester IC on q.course_cycle_ID=IC.course_cycle_ID
              JOIN course_semester CS on IC.course_cycle_ID=CS.cycle_ID
              JOIN course C on CS.Course_ID=C.Course_ID
              JOIN semester S on CS.semester_ID=S.semester_ID
              JOIN users U on IC.instructor_ID=U.user_ID `;
  if (filterInput.instructor_ID) {
    query += ` AND q.instructor_ID=@instructor_ID`;
  }
  query += ` WHERE IC.instructor_ID=@user_ID AND S.end_Date>=GETDATE() AND S.start_Date<=GETDATE() 
             ORDER BY q.created_at DESC OFFSET @offset ROWS FETCH FIRST @limit ROWS ONLY;`;
  return { query, params };
}

export function getStudentCoursesQuizzesQuery(filterInput: {
  user_ID: string;
  instructor_ID?: string;
  page?: number;
  limit?: number;
}): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  const params = { ...filterInput, offset, user_ID: filterInput.user_ID };
  let query = `SELECT q.quiz_ID,q.instructor_ID,U.full_name,q.course_cycle_ID,C.name,
              q.title,q.notes,q.grade,q.start_Date,q.end_Date,q.created_at
              FROM quiz q 
              JOIN student_enrolment SE on q.course_cycle_ID=SE.course_cycle_ID
              JOIN course_semester CS on SE.course_cycle_ID=CS.cycle_ID
              JOIN course C on CS.Course_ID=C.Course_ID
              JOIN semester S on CS.semester_ID=S.semester_ID
              JOIN users U on SE.student_ID=U.user_ID `;
  if (filterInput.instructor_ID) {
    query += ` AND q.instructor_ID=@instructor_ID`;
  }
  query += ` WHERE SE.student_ID=@user_ID AND S.end_Date>=GETDATE() AND S.start_Date<=GETDATE() 
             ORDER BY q.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`;
  return { query, params };
}

export function insertQuizQuery(quizInput: {
  quiz_ID: string;
  course_cycle_ID: string;
  title: string;
  notes: string;
  start_Date: string;
  end_Date: string;
  instructor_ID: string;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO quiz (quiz_ID,course_cycle_ID,title,note,start_Date,end_Date,instructor_ID) 
            VALUES (@quiz_ID,@course_cycle_ID,@title,@notes,@start_Date,@end_Date,@instructor_ID)`,
    params: { ...quizInput },
  };
}

export function updateQuizQuery(updateInput: {
  quiz_ID: string;
  course_cycle_ID?: string;
  title?: string;
  grade?: number;
  start_Date?: string;
  end_Date?: string;
  notes?: string;
}): { query: string; params?: any } {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'quiz_ID' && updateInput[key],
  );

  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');

  return {
    query: `UPDATE quiz SET ${setStatements} WHERE quiz_ID=@quiz_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneQuizQuery(quiz_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM quiz WHERE quiz_ID=@quiz_ID;`,
    params: { quiz_ID },
  };
}
