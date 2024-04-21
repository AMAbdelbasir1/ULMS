// course-semester.query.ts
export function getOneSemesterCourseQuery(cycle_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT CS.cycle_ID,C.course_ID,C.name,C.hours,C.image_path,CS.created_at 
            FROM Course_semester CS join course C 
            on CS.Course_ID=C.Course_ID 
            WHERE CS.cycle_ID=@cycle_ID`,
    params: { cycle_ID },
  };
}

export function getSemesterCourseQuery(cycle_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT CS.semester_ID,S.Faculty_ID,S.start_Date,S.end_Date
            FROM Course_semester CS join semester S 
            on CS.semester_ID=S.semester_ID
            WHERE CS.cycle_ID=@cycle_ID`,
    params: { cycle_ID },
  };
}

export function getSemesterCoursesQuery(
  semester_ID: string,
  page: number,
  limit: number,
): { query: string; params: any } {
  const offset = (page - 1) * limit;

  return {
    query: `SELECT CS.cycle_ID,C.course_ID,C.name,C.hours,C.image_path,CS.created_at 
            FROM Course_semester CS join course C 
            on CS.Course_ID=C.Course_ID 
            WHERE CS.semester_ID=@semester_ID ORDER BY CS.cycle_ID 
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { semester_ID, offset, limit },
  };
}
export function getStudentSemesterCoursesQuery(
  semester_ID: string,
  student_ID: string,
): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT CS.cycle_ID,C.course_ID,C.name,C.hours,C.image_path,CS.created_at 
            FROM Course_semester CS join course C 
            on CS.Course_ID=C.Course_ID join Student_Enrolment SE 
            on SE.course_cycle_ID=CS.cycle_ID
            WHERE CS.semester_ID=@semester_ID AND SE.student_ID=@student_ID 
            ORDER BY CS.cycle_ID;`,
    params: { semester_ID, student_ID },
  };
}

export function getInstructorSemesterCoursesQuery(
  semester_ID: string,
  instructor_ID: string,
): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT CS.cycle_ID,C.course_ID,C.name,C.hours,C.image_path,CS.created_at 
            FROM Course_semester CS join course C 
            on CS.Course_ID=C.Course_ID join instructor_course_semester IC 
            on IC.course_cycle_ID=CS.cycle_ID
            WHERE CS.semester_ID=@semester_ID AND IC.instructor_ID=@instructor_ID 
            ORDER BY CS.cycle_ID `,
    params: { semester_ID, instructor_ID },
  };
}

export function insertSemesterCourseQuery(
  cycle_ID: string,
  course_ID: string,
  semester_ID: string,
): { query: string; params: any } {
  return {
    query: `INSERT INTO Course_semester (cycle_ID,course_ID,semester_ID) 
            VALUES (@cycle_ID, @course_ID, @semester_ID)`,
    params: { cycle_ID, course_ID, semester_ID },
  };
}

export function updateSemesterCourseQuery(updateInput: {
  cycle_ID: string;
  course_ID?: string;
}): { query: string; params: any } {
  let sqlStr = 'UPDATE Course_semester  SET ';
  const { cycle_ID, course_ID } = updateInput;
  const params: any = { cycle_ID };

  if (course_ID) {
    sqlStr += `course_ID=@course_ID `;
    params.course_ID = course_ID;
  }

  return { query: sqlStr + `WHERE cycle_ID=@cycle_ID;`, params };
}

export function deleteOneSemesterCourseQuery(cycle_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `DELETE FROM Course_semester  WHERE cycle_ID=@cycle_ID`,
    params: { cycle_ID },
  };
}
