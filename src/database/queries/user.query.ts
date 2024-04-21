// user.query.ts
export function getOneUserQuery(user_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT user_ID, Faculty_ID, email,image_path FROM Users WHERE user_ID=@user_ID`,
    params: { user_ID },
  };
}

export function getOneUserWithRoleQuery(user_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT u.user_ID, u.Faculty_ID, r.name as roles FROM Users u
            JOIN user_role ur ON u.user_ID=ur.user_ID
            JOIN role r ON ur.role_ID = r.role_ID WHERE u.user_ID=@user_ID`,
    params: { user_ID },
  };
}

export function getOneUserEmailQuery(email: string): {
  query: string;
  params: any;
} {
  return {
    query: 'SELECT user_ID, password FROM Users WHERE email=@email',
    params: { email },
  };
}

export function getOneUserPhoneQuery(phone: string): {
  query: string;
  params: any;
} {
  return {
    query: `SELECT user_ID FROM Users WHERE phone=@phone`,
    params: { phone },
  };
}

export function createUsersQuery(newUser: {
  user_ID: string;
  full_name: string;
  email: string;
  password: string;
  faculty_ID?: string;
  phone?: string;
}): { query: string; params: any } {
  const insertFaculty = newUser.faculty_ID ? ', faculty_ID' : '';
  const insertPhone = newUser.phone ? ', phone' : '';
  const valueFaculty = newUser.faculty_ID ? ', @faculty_ID' : '';
  const valuePhone = newUser.phone ? ', @phone' : '';
  return {
    query: `
      INSERT INTO Users (user_ID, full_name, email, password ${insertFaculty} ${insertPhone})
      VALUES (@user_ID, @full_name, @email, @password ${valueFaculty} ${valuePhone});
    `,
    params: newUser,
  };
}

export function getUsersQuery(filter: {
  page: number;
  limit: number;
  faculty_ID?: string;
  role?: string;
}): { query: string; params: any } {
  const { page, limit, ...inputData } = filter;

  const offset = (page - 1) * limit;
  let whereClause = 'WHERE 1=1';

  if (filter.faculty_ID) {
    whereClause += ` AND u.faculty_ID=@faculty_ID`;
  }

  if (filter.role) {
    whereClause += ` AND r.name=@role`;
  }

  return {
    query: `SELECT u.user_ID, u.full_name, u.email, u.image_path, u.status, r.name as roles
            FROM Users u
            JOIN user_role ur ON u.user_ID = ur.user_ID
            JOIN role r ON ur.role_ID = r.role_ID
            ${whereClause}
            ORDER BY user_ID
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY;`,
    params: { ...inputData, offset, limit },
  };
}

export function getStudentsUserQuery(filter: {
  page: number;
  limit: number;
  department_ID?: string;
  faculty_ID?: string;
  level?: number;
}): { query: string; params: any } {
  const { page, limit, ...inputData } = filter;
  const offset = (page - 1) * limit;
  let whereClause = '';
  whereClause += filter.department_ID
    ? `AND si.department_ID=@department_ID`
    : '';
  whereClause += filter.faculty_ID ? `AND u.faculty_ID=@faculty_ID` : '';
  whereClause += filter.level ? `AND si.level=@level` : '';
  return {
    query: `SELECT u.user_ID, u.full_name, u.email, u.image_path, u.status, r.name as roles
            FROM Users u
            JOIN user_role ur ON u.user_ID = ur.user_ID
            JOIN role r ON ur.role_ID = r.role_ID
            JOIN student_info si ON si.user_ID = u.user_ID
            WHERE 1=1 ${whereClause}
            ORDER BY user_ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;`,
    params: { ...inputData, offset, limit },
  };
}

export function updateUserQuery(updateInput: {
  full_name?: string;
  email?: string;
  password?: string;
  faculty_ID?: string;
  phone?: string;
  image_path?: string;
  user_ID: string;
}): { query: string; params: any } {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'user_ID' && updateInput[key],
  );
  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');
  return {
    query: `UPDATE Users SET ${setStatements} WHERE user_ID=@user_ID;`,
    params: updateInput,
  };
}

export function deleteUserQuery(user_ID: string): {
  query: string;
  params: any;
} {
  return {
    query: `DELETE FROM Users WHERE user_ID=@user_ID`,
    params: { user_ID },
  };
}
