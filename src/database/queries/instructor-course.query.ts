export function getInstructorsCourseQuery(course_cycle_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT IC.instructor_ID,U.full_name,U.email,U.image_path,R.name as roles
              FROM instructor_course_semester IC 
              join users U on IC.instructor_ID=U.user_ID  
              JOIN user_role UR ON U.user_ID = UR.user_ID
              JOIN role R ON UR.role_ID = R.role_ID
              WHERE IC.course_cycle_ID=@course_cycle_ID 
              ORDER BY IC.created_at`,
    params: { course_cycle_ID },
  };
}

export function getOneInstructorCourseQuery(
  instructor_ID: string,
  course_cycle_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT * FROM instructor_course_semester 
            WHERE instructor_ID=@instructor_ID AND course_cycle_ID=@course_cycle_ID`,
    params: { instructor_ID, course_cycle_ID },
  };
}

export function insertInstructorCourseQuery(insertInput: {
  instructor_ID: string;
  course_cycle_ID: string;
}): { query: string; params?: any } {
  return {
    query: `
      INSERT INTO instructor_course_semester (instructor_ID,course_cycle_ID)
      VALUES (@instructor_ID,@course_cycle_ID)
    `,
    params: { ...insertInput },
  };
}

export function deleteInstructorCourseQuery(
  instructor_ID: string,
  course_cycle_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM instructor_course_semester WHERE 
              instructor_ID=@instructor_ID AND course_cycle_ID=@course_cycle_ID`,
    params: { instructor_ID, course_cycle_ID },
  };
}
