export function getOneDepartmentQuery(department_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM department WHERE department_ID=@department_ID`,
    params: { department_ID },
  };
}

export function getDepartmentByNameQuery(
  name: string,
  faculty_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT name FROM department WHERE name=@name AND faculty_ID=@faculty_ID`,
    params: { name, faculty_ID },
  };
}

export function getDepartmentByFacultyQuery(
  department_ID: string,
  faculty_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT name FROM department WHERE department_ID=@department_ID AND faculty_ID=@faculty_ID`,
    params: { department_ID, faculty_ID },
  };
}

export function getAllDepartmentQuery(
  page: number,
  limit: number,
  faculty_ID: string,
): { query: string; params?: any } {
  const offset = (page - 1) * limit;

  return {
    query: `SELECT department_ID,name,created_at FROM department WHERE faculty_ID = @faculty_ID
          ORDER BY created_at OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { faculty_ID, offset, limit },
  };
}

export function insertDepartmentQuery(
  ID: string,
  faculty_ID: string,
  name: string,
): { query: string; params?: any } {
  return {
    query: `INSERT INTO department(department_ID,faculty_ID,name) VALUES (@ID,@faculty_ID,@name)`,
    params: { ID, faculty_ID, name },
  };
}

export function updateDepartmentQuery(updateInput: {
  department_ID: string;
  name?: string;
}): { query: string; params?: any } {
  return {
    query: `UPDATE department SET name=@name WHERE department_ID=@department_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneDepartmentQuery(department_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Department WHERE department_ID=@department_ID`,
    params: { department_ID },
  };
}
