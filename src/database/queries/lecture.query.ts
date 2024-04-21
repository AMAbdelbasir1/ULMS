export function getOneLectureQuery(lecture_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT lecture_ID,instructor_ID,type FROM lecture WHERE lecture_ID=@lecture_ID`,
    params: { lecture_ID },
  };
}

export function getOneInstructorLectureQuery(
  instructor_ID: string,
  lecture_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT L.lecture_ID FROM lecture L JOIN instructor_course_semester IC
            ON L.course_cycle_ID=IC.course_cycle_ID
            WHERE L.lecture_ID=@lecture_ID AND IC.instructor_ID=@instructor_ID`,
    params: { lecture_ID, instructor_ID },
  };
}

export function getOneStudentEnrolmentLectureQuery(
  student_ID: string,
  lecture_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT L.lecture_ID FROM lecture L JOIN Student_Enrolment SE
            ON L.course_cycle_ID=SE.course_cycle_ID
            WHERE L.lecture_ID=@lecture_ID AND SE.student_ID=@student_ID`,
    params: { lecture_ID, student_ID },
  };
}

export function getOneSemesterLectureQuery(lecture_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT S.end_Date FROM lecture L JOIN course_semester CS
            ON L.course_cycle_ID=CS.cycle_ID JOIN semester S
            ON CS.semester_ID=S.semester_ID
            WHERE L.lecture_ID=@lecture_ID`,
    params: { lecture_ID },
  };
}

export function getLecturesCourseQuery(filterInput: {
  course_cycle_ID: string;
  page: number;
  limit: number;
  type?: string;
  instructor_ID?: string;
}): { query: string; params?: any } {
  const { page, ...filter } = filterInput;
  const offset = (page - 1) * filterInput.limit;
  let whereClause = '';

  if (filterInput.type) {
    whereClause += `AND L.type=@type`;
  }

  if (filterInput.instructor_ID) {
    whereClause += ` AND L.instructor_ID=@instructor_ID`;
  }
  return {
    query: `SELECT L.lecture_ID,L.title,L.type,L.instructor_ID,U.full_name,L.created_at
            FROM lecture L JOIN users U 
            on L.instructor_ID=U.user_ID
            WHERE L.course_cycle_ID=@course_cycle_ID ${whereClause}
            ORDER BY L.created_at DESC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { ...filter, offset },
  };
}

export function insertLectureQuery(lectureInput: {
  lecture_ID: string;
  title: string;
  type: string;
  course_cycle_ID: string;
  instructor_ID: string;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO lecture (lecture_ID,title,type,course_cycle_ID,instructor_ID) 
            VALUES (@lecture_ID,@title,@type,@course_cycle_ID,@instructor_ID)`,
    params: { ...lectureInput },
  };
}

export function updateLectureQuery(updateInput: {
  lecture_ID: string;
  title?: string;
  type?: string;
}): { query: string; params?: any } {
  let setClause = '';

  for (const key in updateInput) {
    if (key !== 'lecture_ID' && updateInput[key]) {
      setClause += `${key}=@${key},`;
    }
  }

  setClause = setClause.replace(/,$/, '');
  return {
    query: `UPDATE lecture SET ${setClause} WHERE lecture_ID=@lecture_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneLectureQuery(lecture_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM lecture WHERE lecture_ID=@lecture_ID`,
    params: { lecture_ID },
  };
}
