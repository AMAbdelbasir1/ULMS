import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

import { DatabaseService } from 'src/database/database.service';
import {
  CurrentUser,
  UpdateUserInput,
  UserFilterInput,
  CreateUserInput,
} from './user.input';
import { handleError } from 'src/utils/graph.error';
import {
  createUsersQuery,
  deleteUserQuery,
  getOneUserWithRoleQuery,
  updateUserQuery,
} from 'src/database/queries/user.query';
import {
  deleteUserRolesQuery,
  insertUserRoleQuery,
} from 'src/database/queries/user-role.query';
import {
  deleteOneStudentInformationQuery,
  insertStudentInformationQuery,
  updateStudentInformationQuery,
} from 'src/database/queries/student-information.query';
import { deleteFile, saveImage } from 'src/utils';
import { errorMessage } from './message.error';
import { createPromisesQuery, updatePromisesQuery } from './promisesQuery';
import { createCheckQuery, updateCheckQuery } from './checkQuery';
import { QueryResult } from 'src/database/database.entity';
import { getFacultyUser, getUsers, transformUsers } from './user.helper';

@Injectable()
export class UserService {
  constructor(private readonly conn: DatabaseService) {}
  /**
   * Retrieves a list of users based on the provided filter input and current user.
   * If the current user is an admin, only users in their own faculty will be returned.
   * If the current user is a superadmin, all users will be returned.
   * @param filterInput - The filter input object.
   * @param currentUser - The current user object.
   * @returns The list of users.
   */
  async getUsersService(
    filterInput: UserFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      let users: QueryResult;
      if (currentUser.roles.includes('ADMIN')) {
        filterInput.faculty_ID = currentUser.Faculty_ID;
        users = await this.conn.query(getFacultyUser(filterInput));
      } else {
        users = await this.conn.query(getUsers(filterInput));
      }

      return transformUsers(users.recordset);
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /********************************************************
   * Creates a new user with the provided user input.
   * Performs data validation, role validation, and inserts the user in the user-role and student-info tables.
   * @param createUserInput - The user input object.
   * @returns A success message indicating that the user was inserted successfully.
   */
  async createUserService(
    createUserInput: CreateUserInput,
    currentUser: CurrentUser,
  ) {
    try {
      if (currentUser.roles.includes('ADMIN')) {
        createUserInput.Faculty_ID = currentUser.Faculty_ID;
      }
      
      const resultPromisesQuery = await createPromisesQuery(
        createUserInput,
        this.conn,
      );

      if (
        resultPromisesQuery[0].recordset[0].name == 'SUPERADMIN' &&
        createUserInput.Faculty_ID
      ) {
        createUserInput.Faculty_ID = null;
      }
      
      await createCheckQuery(
        resultPromisesQuery,
        createUserInput.Faculty_ID,
        currentUser,
      );

      createUserInput.password = await bcrypt.hash(
        createUserInput.password,
        10,
      );

      const user_ID = uuid();
      const queries = [];

      queries.push(
        createUsersQuery({
          user_ID: user_ID,
          full_name: createUserInput.full_name,
          email: createUserInput.email,
          password: createUserInput.password,
          faculty_ID: createUserInput.Faculty_ID || null,
          phone: createUserInput.phone || null,
        }),
      );

      queries.push(insertUserRoleQuery(createUserInput.role_ID, user_ID));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [existingRole, ..._] = resultPromisesQuery;
      if (existingRole.recordset[0].name == 'STUDENT') {
        queries.push(
          insertStudentInformationQuery({
            academic_ID: createUserInput.academic_ID,
            user_ID: user_ID,
            department_ID: createUserInput.department_ID,
            level: createUserInput.level,
          }),
        );
      }
      await this.conn.executeTransaction(queries);

      return 'User inserted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /*************************************************************************
   * Updates the user account with the provided update input and current user.
   * Depending on the user's role, different fields can be updated.
   * @param updateUserInput - The update input object.
   * @param currentUser - The current user object.
   * @returns A success message indicating that the user account was updated successfully.
   */
  async updateUserService(
    updateUserInput: UpdateUserInput,
    currentUser: CurrentUser,
  ) {
    let imagePath: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_ID, image_path, ...updateInput } = updateUserInput;
    try {
      if (Object.keys(updateInput).length === 0 && !(await image_path)) {
        throw 'ENTER_DATA';
      }
      const resultPromisesQuery = await updatePromisesQuery(
        updateUserInput,
        this.conn,
      );

      await updateCheckQuery(resultPromisesQuery, currentUser);

      if (updateUserInput.image_path) {
        imagePath = await saveImage(await updateUserInput.image_path, 'user');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      const roles = resultPromisesQuery[0].recordset.map(
        (record) => record.roles,
      );
      if (updateUserInput.password) {
        updateUserInput.password = await bcrypt.hash(
          updateUserInput.password,
          10,
        );
      }

      const userInputQuery = updateUserQuery({
        user_ID: updateUserInput.user_ID,
        full_name: updateUserInput.full_name,
        email: updateUserInput.email,
        phone: updateUserInput.phone,
        password: updateUserInput.password,
        image_path: imagePath || null,
      });

      if (
        roles.includes('STUDENT') &&
        updateUserInput.academic_ID &&
        updateUserInput.level &&
        updateUserInput.department_ID
      ) {
        const queries = [];
        queries.push(
          updateStudentInformationQuery({
            user_ID: updateUserInput.user_ID,
            academic_ID: updateUserInput.academic_ID,
            level: updateUserInput.level,
            department_ID: updateUserInput.department_ID,
          }),
        );
        queries.push(userInputQuery);
        await this.conn.executeTransaction(queries);
      } else {
        await this.conn.query(userInputQuery);
      }
      return 'User account updated successfully';
    } catch (error) {
      if (imagePath) {
        await deleteFile(imagePath);
      }
      handleError(error, errorMessage);
    }
  }

  /****************************************************************************
   * Deletes the user account with the provided user ID and current user.
   * Only users with the appropriate permissions can delete user accounts.
   * @param user_ID - The ID of the user account to delete.
   * @param currentUser - The current user object.
   * @returns A success message indicating that the user account was deleted successfully.
   */
  async deleteUserService(user_ID: string, currentUser: CurrentUser) {
    try {
      const user = await this.conn.query(getOneUserWithRoleQuery(user_ID));
      if (user.recordset.length == 0) {
        throw 'NOT_EXIST_USER';
      }
      if (
        user.recordset[0].Faculty_ID !== currentUser.Faculty_ID &&
        currentUser.roles.includes('ADMIN')
      ) {
        throw 'UNAUTHORIZED';
      }
      const queries = [];

      queries.push(deleteUserRolesQuery(user_ID));
      const roles = user.recordset.map((record) => record.roles);
      if (roles.includes('STUDENT')) {
        queries.push(deleteOneStudentInformationQuery(user_ID));
      }
      queries.push(deleteUserQuery(user_ID));
      await this.conn.executeTransaction(queries);
      return 'User account deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
