export function getOneRoleQuery(ID: string): { query: string; params?: any } {
  return { query: `SELECT * FROM role WHERE role_ID=@ID`, params: { ID } };
}

export function getRoleByNameQuery(name: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT name FROM role WHERE name=@name`,
    params: { name },
  };
}

export function getAllRoleQuery(
  page: number,
  limit: number,
): { query: string; params?: any } {
  const offset = (page - 1) * limit;
  const params: any = { offset, limit };
  return {
    query: `SELECT * FROM role ORDER BY role_ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params,
  };
}

export function insertRoleQuery(
  role_ID: string,
  name: string,
): { query: string; params?: any } {
  return {
    query: `INSERT INTO role(role_ID,name) VALUES (@role_ID,@name)`,
    params: { role_ID, name },
  };
}

export function updateRoleQuery(updateInput: {
  role_ID: string;
  name?: string;
}): { query: string; params?: any } {
  return {
    query: `UPDATE role SET name=@name WHERE role_ID=@role_ID;`,
    params: { role_ID: updateInput.role_ID, name: updateInput.name },
  };
}

export function deleteOneRoleQuery(ID: string): {
  query: string;
  params?: any;
} {
  return { query: `DELETE FROM role WHERE role_ID=@ID`, params: { ID } };
}
