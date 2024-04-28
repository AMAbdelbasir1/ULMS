import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import {
  deleteOneDepartmentQuery,
  getAllDepartmentQuery,
  getDepartmentByNameQuery,
  getOneDepartmentQuery,
  insertDepartmentQuery,
  updateDepartmentQuery,
} from 'src/database/queries/department.query';
import {
  DepartmentFilterInput,
  DepartmentInput,
  DepartmentUpdateInput,
} from './department.input';
import { handleError } from 'src/utils/graph.error';
import { CurrentUser } from 'src/user/user.input';
import { errorMessage } from './message.error';
import { updateDepartmentPromisesQuery } from './promisesQuery';
import {
  deleteDepartmentCheckQuery,
  updateDepartmentCheckQuery,
} from './checkQuery';

@Injectable()
export class DepartmentService {
  constructor(private readonly conn: DatabaseService) {}

  /**
   *
   * @param departmentFilterInput
   * @returns
   */
  async getAllDepartmentService(
    departmentFilterInput: DepartmentFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit } = departmentFilterInput;
      page = page || 1; // Default to page 1 if not provided
      limit = limit || 10; // Default to a limit of 10 if not provided
      const departments = await this.conn.query(
        getAllDepartmentQuery(page, limit, currentUser.Faculty_ID),
      );
      return departments.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param departmetInput
   * @returns
   */
  async createDepartmentService(
    departmetInput: DepartmentInput,
    currentUser: CurrentUser,
  ): Promise<string> {
    try {
      const existingDepartment = await this.conn.query(
        getDepartmentByNameQuery(departmetInput.name, currentUser.Faculty_ID),
      );
      if (existingDepartment.recordset.length > 0) {
        throw 'EXISTS_DEPARTMENT';
      }
      await this.conn.query(
        insertDepartmentQuery(
          uuid(),
          currentUser.Faculty_ID,
          departmetInput.name,
        ),
      );
      return 'Department created successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   * @
   * @param updateDepartmentInput
   * @returns
   */
  async updateDepartmentService(
    updateDepartmentInput: DepartmentUpdateInput,
    currentUser: CurrentUser,
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { department_ID, ...updateInput } = updateDepartmentInput;
    try {
      if (Object.keys(updateInput).length === 0) {
        throw 'ENTER_DATA';
      }
      const resultCoursePromise = await updateDepartmentPromisesQuery(
        updateDepartmentInput,
        this.conn,
        currentUser,
      );

      updateDepartmentCheckQuery(resultCoursePromise, currentUser);

      await this.conn.query(updateDepartmentQuery(updateDepartmentInput));
      return 'Department updated successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *@ Delete Function sevice for deleteing department by
   * @param department_ID
   * @returns string
   */
  async deleteDepartmentService(
    department_ID: string,
    currentUser: CurrentUser,
  ): Promise<string> {
    try {
      const existingDepartment = await this.conn.query(
        getOneDepartmentQuery(department_ID),
      );

      deleteDepartmentCheckQuery(existingDepartment, currentUser);

      await this.conn.query(deleteOneDepartmentQuery(department_ID));
      return 'Department deleted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
