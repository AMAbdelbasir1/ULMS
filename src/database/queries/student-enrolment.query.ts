export function getStudentsEnrolmentQuery(course_cycle_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT SE.student_ID,U.full_name,U.email,U.image_path,SI.academic_ID 
            FROM Student_Enrolment SE 
            join users U on SE.student_ID=U.user_ID
            join student_info SI on U.user_ID=SI.user_ID
            WHERE SE.course_cycle_ID=@course_cycle_ID 
            ORDER BY SE.created_at`,
    params: { course_cycle_ID },
  };
}

export function getOneStudentEnrolmentQuery(
  student_ID: string,
  course_cycle_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT * FROM Student_Enrolment 
            WHERE student_ID=@student_ID AND course_cycle_ID=@course_cycle_ID`,
    params: { student_ID, course_cycle_ID },
  };
}

export function insertStudentEnrolmentQuery(insertInput: {
  student_ID: string;
  course_cycle_ID: string;
}): { query: string; params?: any } {
  return {
    query: `
    INSERT INTO Student_Enrolment (student_ID,course_cycle_ID)
    VALUES (@student_ID,@course_cycle_ID)
  `,
    params: { ...insertInput },
  };
}

export function deleteStudentEnrolmentQuery(
  student_ID: string,
  course_cycle_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Student_Enrolment WHERE 
            student_ID=@student_ID AND course_cycle_ID=@course_cycle_ID`,
    params: { student_ID, course_cycle_ID },
  };
}
