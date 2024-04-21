export function getOneUniversityQuery(university_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM University WHERE university_ID=@university_ID`,
    params: { university_ID },
  };
}

export function getUniversityByNameQuery(name: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM University WHERE name=@name`,
    params: { name },
  };
}

export function getAllUniversityQuery(): {
  query: string;
} {
  return {
    query: `SELECT * FROM University`,
  };
}

export function insertUniversityQuery(
  ID: string,
  name: string,
  logoPath: string,
): { query: string; params?: any } {
  return {
    query: `
    INSERT INTO University (university_ID, name, Logo_path)
    VALUES (@ID, @name, @logoPath)
  `,
    params: { ID, name, logoPath },
  };
}

export function updateUniversityQuery(updateInput: {
  ID: string;
  name: string;
  logo: string;
}): { query: string; params?: any } {
  let sqlStr = `UPDATE University SET `;
  const params: any = { ID: updateInput.ID };
  if (updateInput.logo) {
    sqlStr += `logo_path=@logo `;
    params.logo = updateInput.logo;
  }
  if (updateInput.name) {
    if (updateInput.logo) sqlStr += ',';
    sqlStr += `name=@name`;
    params.name = updateInput.name;
  }
  return { query: sqlStr + ` WHERE University_ID=@ID;`, params };
}

export function deleteOneUniversityQuery(university_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM University WHERE university_ID=@university_ID`,
    params: { university_ID },
  };
}
