import {
  getStudentsUserQuery,
  getUsersQuery,
} from 'src/database/queries/user.query';
import { UserFilterInput } from './user.input';

export function getFacultyUser(filterInput: UserFilterInput) {
  if (filterInput.role == 'Student') {
    return getStudentsUserQuery({
      page: filterInput.page || 1,
      limit: filterInput.limit || 20,
      faculty_ID: filterInput.faculty_ID,
      department_ID: filterInput.department_ID,
      level: filterInput.level,
    });
  } else {
    return getUsersQuery({
      page: filterInput.page || 1,
      limit: filterInput.limit || 20,
      faculty_ID: filterInput.faculty_ID,
      role: filterInput.role?.toUpperCase(),
    });
  }
}

export function getUsers(filterInput: UserFilterInput) {
  if (filterInput.role == 'Student') {
    return getStudentsUserQuery({
      page: filterInput.page || 1,
      limit: filterInput.limit || 20,
      faculty_ID: filterInput.faculty_ID,
      department_ID: filterInput.department_ID,
      level: filterInput.level,
    });
  } else {
    return getUsersQuery({
      page: filterInput.page || 1,
      limit: filterInput.limit || 20,
      faculty_ID: filterInput.faculty_ID,
      role: filterInput.role?.toUpperCase(),
    });
  }
}
export function transformUsers(users: any[]): any[] {
  const transformedUsers = [];
  const userMap = new Map();

  for (const user of users) {
    const userId = user.user_ID;
    if (!userMap.has(userId)) {
      userMap.set(userId, true);
      user.roles = [user.roles];
      transformedUsers.push(user);
    } else {
      const existingUser = transformedUsers.find((u) => u.user_ID === userId);
      existingUser.roles.push(user.roles);
    }
  }

  return transformedUsers;
}
