export function getOneFacultyQuery(ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM faculty WHERE Faculty_ID=@ID`,
    params: { ID },
  };
}

export function getFacultyByNameQuery(
  name: string,
  university_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT * FROM faculty WHERE name=N'@name' AND university_ID=@university_ID`,
    params: { name, university_ID },
  };
}

export function getAllFacultyQuery(
  page: number,
  limit: number,
  university_ID?: string,
): { query: string; params?: any } {
  const offset = (page - 1) * limit;
  const params: any = { offset, limit };
  let whereClause = '';
  if (university_ID) {
    whereClause = `WHERE f.university_ID = @university_ID`;
    params.university_ID = university_ID;
  }

  return {
    query: `SELECT f.faculty_ID,f.name,f.Logo_path ,u.university_ID,u.name as university_name,f.created_at
          FROM faculty f join university u on f.university_ID = u.university_ID
          ${whereClause} ORDER BY f.faculty_ID 
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params,
  };
}

export function insertFacultyQuery(
  ID: string,
  facultyInput: { university_ID: string; name: string; levels: number },
  logoPath: string,
): { query: string; params?: any } {
  return {
    query: `INSERT INTO faculty(faculty_ID,university_ID,name,levels,logo_path) 
          VALUES (@ID,@university_ID,N'@name',@levels,'@logoPath')`,
    params: { ID, ...facultyInput, logoPath },
  };
}

export function updateFacultyQuery(updateInput: {
  Faculty_ID: string;
  university_ID?: string;
  name?: string;
  levels?: number;
  last_semester_ID?: string;
  Logo_path?: string;
}): { query: string; params?: any } {
  let setClause = '';
  for (const key in updateInput) {
    if (key !== 'Faculty_ID' && updateInput[key]) {
      setClause += `${key}=@${key},`;
    }
  }
  setClause = setClause.replace(/,$/, '');
  return {
    query: `UPDATE Faculty SET ${setClause} WHERE Faculty_ID=@Faculty_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneFacultyQuery(ID: string): {
  query: string;
  params?: any;
} {
  return { query: `DELETE FROM Faculty WHERE Faculty_ID=@ID`, params: { ID } };
}
