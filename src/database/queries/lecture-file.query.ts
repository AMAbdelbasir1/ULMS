export function getOneLectureFileQuery(lecture_file_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT lecture_ID,instructor_ID,file_path FROM lecture_file WHERE lecture_file_ID=@lecture_file_ID`,
    params: { lecture_file_ID },
  };
}

export function getOneInstructorLectureFileQuery(
  instructor_ID: string,
  lecture_file_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT L.lecture_ID FROM lecture_file LF JOIN lecture L
            ON LF.lecture_ID=L.lecture_ID JOIN
            instructor_course_semester IC
            ON L.course_cycle_ID=IC.course_cycle_ID
            WHERE LF.lecture_file_ID=@lecture_file_ID AND IC.instructor_ID=@instructor_ID`,
    params: { lecture_file_ID, instructor_ID },
  };
}

export function getOneStudentEnrollmentLectureFileQuery(
  student_ID: string,
  lecture_file_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT L.lecture_ID FROM lecture_file LF JOIN lecture L
            ON LF.lecture_ID=L.lecture_ID JOIN
            student_enrolment SE
            ON L.course_cycle_ID=SE.course_cycle_ID
            WHERE LF.lecture_file_ID=@lecture_file_ID AND SE.student_ID=@student_ID`,
    params: { lecture_file_ID, student_ID },
  };
}

export function getOneSemesterLectureQuery(lecture_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT S.end_Date,S.start_Date FROM lecture L JOIN course_semester CS
            ON L.course_cycle_ID=CS.cycle_ID JOIN semester S
            ON CS.semester_ID=S.semester_ID
            WHERE L.lecture_ID=@lecture_ID`,
    params: { lecture_ID },
  };
}

export function getLecturesFilesCourseQuery(filterInput: {
  lecture_ID: string;
  type?: string;
  extension?: string;
  instructor_ID?: string;
}): { query: string; params?: any } {
  let whereClause = '';

  if (filterInput.type) {
    whereClause += `AND L.type=@type`;
  }

  if (filterInput.instructor_ID) {
    whereClause += ` AND LF.instructor_ID=@instructor_ID`;
  }

  if (filterInput.extension) {
    whereClause += ` AND LF.extension=@extension`;
  }

  return {
    query: `SELECT LF.lecture_file_ID,LF.name,LF.file_path,LF.extension,LF.type,LF.instructor_ID,U.full_name,LF.created_at
            FROM lecture_file LF 
            JOIN users U on LF.instructor_ID=U.user_ID
            WHERE LF.lecture_ID=@lecture_ID ${whereClause}
            ORDER BY LF.created_at DESC ;`,
    params: { ...filterInput },
  };
}

export function insertLectureFileQuery(lectureInput: {
  lecture_ID: string;
  lecture_file_ID: string;
  name: string;
  file_path: string;
  extension: string;
  type: string;
  instructor_ID: string;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO lecture_file (lecture_file_ID,lecture_ID,name,file_path,extension,type,instructor_ID) 
            VALUES (@lecture_file_ID,@lecture_ID,@name,@file_path,@extension,@type,@instructor_ID)`,
    params: { ...lectureInput },
  };
}

export function updateLectureFileQuery(updateInput: {
  lecture_file_ID: string;
  name: string;
}): { query: string; params?: any } {
  return {
    query: `UPDATE lecture_file SET name=@name WHERE lecture_file_ID=@lecture_file_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneLectureFileQuery(lecture_File_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM lecture_File WHERE lecture_File_ID=@lecture_File_ID`,
    params: { lecture_File_ID },
  };
}
