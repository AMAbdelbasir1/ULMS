export function getOneStudentInformationQuery(user_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM Student_Info WHERE user_ID=@user_ID`,
    params: { user_ID },
  };
}

export function getOneStudentInformationAcademicQuery(academic_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM Student_Info WHERE academic_ID=@academic_ID`,
    params: { academic_ID },
  };
}

export function insertStudentInformationQuery(studentInfoInput: {
  academic_ID: string;
  user_ID: string;
  department_ID: string;
  level: number;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO Student_Info(academic_ID,user_ID,department_ID,level) VALUES (@academic_ID, @user_ID, @department_ID, @level)`,
    params: studentInfoInput,
  };
}

export function updateStudentInformationQuery(studentInfoUpdateInput: {
  user_ID: string;
  academic_ID?: string;
  department_ID?: string;
  level?: number;
}): { query: string; params?: any } {
  let sqlStr = 'UPDATE Student_Info SET ';
  const params: any = {};
  for (const key in studentInfoUpdateInput) {
    if (key !== 'user_ID' && studentInfoUpdateInput[key]) {
      sqlStr += `${key}=@${key},`;
      params[key] = studentInfoUpdateInput[key];
    }
  }
  // Remove the trailing comma if present
  sqlStr = sqlStr.replace(/,$/, '');

  return { query: sqlStr + ` WHERE user_ID=@user_ID`, params };
}

export function deleteOneStudentInformationQuery(user_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Student_Info WHERE user_ID=@user_ID`,
    params: { user_ID },
  };
}
