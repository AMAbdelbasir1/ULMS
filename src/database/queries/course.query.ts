export function getOneCourseQuery(course_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM Course WHERE Course_ID=@course_ID`,
    params: { course_ID },
  };
}

export function getCourseByNameQuery(
  name: string,
  faculty_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT * FROM Course WHERE name=@name AND faculty_ID=@faculty_ID`,
    params: { name, faculty_ID },
  };
}

export function getAllCourseQuery(
  page: number,
  limit: number,
  faculty_ID?: string,
): { query: string; params?: any } {
  const offset = (page - 1) * limit;
  const whereClause = faculty_ID ? `WHERE faculty_ID = @faculty_ID` : '';

  return {
    query: `SELECT * FROM Course ${whereClause} ORDER BY Course_ID 
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { faculty_ID, offset, limit },
  };
}

export function insertCourseQuery(
  course_ID: string,
  CourseInput: { faculty_ID: string; name: string; hours: number },
  imagePath: string,
): { query: string; params?: any } {
  return {
    query: `INSERT INTO Course(Course_ID,faculty_ID,name,hours,image_path) VALUES (@course_ID,@faculty_ID,@name,@hours,@imagePath)`,
    params: { course_ID, ...CourseInput, imagePath },
  };
}

export function updateCourseQuery(updateInput: {
  course_ID: string;
  faculty_ID?: string;
  name?: string;
  hours?: number;
  last_semester_ID?: string;
  image_path?: string;
}): { query: string; params?: any } {
  let sqlStr = 'UPDATE Course SET ';

  for (const key in updateInput) {
    if (key !== 'course_ID' && updateInput[key]) {
      sqlStr += `${key}=@${key},`;
    }
  }
  // Remove the trailing comma if present
  sqlStr = sqlStr.replace(/,$/, '');

  return {
    query: sqlStr + ` WHERE Course_ID=@course_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneCourseQuery(course_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Course WHERE Course_ID=@course_ID`,
    params: { course_ID },
  };
}
