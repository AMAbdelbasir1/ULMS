export function getOneUserRoleQuery(
  role_ID: string,
  user_ID: string,
): { query: string; params?: any } {
  return {
    query: `SELECT * FROM User_role WHERE role_ID=@role_ID AND user_ID=@user_ID`,
    params: { role_ID, user_ID },
  };
}

export function getAllUserRolesQuery(user_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT UR.role_ID,R.name FROM User_role UR join role R on UR.role_ID=R.role_ID WHERE UR.user_ID=@user_ID`,
    params: { user_ID },
  };
}

export function insertUserRoleQuery(
  role_ID: string,
  user_ID: string,
): { query: string; params?: any } {
  return {
    query: `INSERT INTO User_role(role_ID,user_ID) VALUES (@role_ID, @user_ID)`,
    params: { role_ID, user_ID },
  };
}

export function deleteOneUserRoleQuery(
  role_ID: string,
  user_ID: string,
): { query: string; params?: any } {
  return {
    query: `DELETE FROM User_role WHERE role_ID=@role_ID AND user_ID=@user_ID`,
    params: { role_ID, user_ID },
  };
}

export function deleteUserRolesQuery(user_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM User_role WHERE user_ID=@user_ID`,
    params: { user_ID },
  };
}
