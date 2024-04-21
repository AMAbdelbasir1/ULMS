// This is a TypeScript file for a NestJS service that handles user roles. It includes methods to create and delete user roles.

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserRoleInput } from './user-role.input';
import {
  deleteOneUserRoleQuery,
  getAllUserRolesQuery,
  insertUserRoleQuery,
} from 'src/database/queries/user-role.query';
import { handleError } from 'src/utils/graph.error';
import { CurrentUser } from 'src/user/user.input';
import { errorMessage } from './message.error';
import {
  createUserRolePromisesQuery,
  deleteUserRolePromisesQuery,
} from './promisesQuery';
import {
  createUserRoleCheckQuery,
  deleteUserRoleCheckQuery,
} from './checkQuery';

@Injectable()
export class UserRoleService {
  constructor(private readonly conn: DatabaseService) {}

  async getAllUserRolesService(currentUser: CurrentUser, user_ID?: string) {
    try {
      console.log(user_ID);
      if (!user_ID) {
        user_ID = currentUser.user_ID;
      }
      const userRoles = await this.conn.query(getAllUserRolesQuery(user_ID));

      const roles = userRoles.recordset.map(
        (role: { role_ID: string; name: string }) => {
          return { role_ID: role.role_ID, name: role.name };
        },
      );
      
      return roles;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   * Method to create a user role
   * @param userRoleInput
   * @param currentUser
   * @returns
   */
  async createUserRoleService(
    userRoleInput: UserRoleInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { user_ID, role_ID } = userRoleInput;
      const resultUserRolePromise = await createUserRolePromisesQuery(
        userRoleInput,
        this.conn,
      );
      createUserRoleCheckQuery(resultUserRolePromise, currentUser);
      await this.conn.query(insertUserRoleQuery(role_ID, user_ID));
      return 'Role assigned to user successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   * Method to delete a user role
   * @param userRoleInput
   * @param currentUser
   * @returns
   */
  async deleteUserRoleService(
    userRoleInput: UserRoleInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { user_ID, role_ID } = userRoleInput;
      const resultUserRolePromise = await deleteUserRolePromisesQuery(
        userRoleInput,
        this.conn,
      );
      deleteUserRoleCheckQuery(resultUserRolePromise, currentUser);
      await this.conn.query(deleteOneUserRoleQuery(role_ID, user_ID));
      return 'Deleted role successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
