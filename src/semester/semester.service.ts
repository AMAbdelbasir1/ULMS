/**
 * This file contains the SemesterService class which is responsible for handling semester-related operations.
 */
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';
import {
  SemesterFilterInput,
  SemesterInput,
  UpdateSemesterInput,
} from './semester.input';
import {
  deleteOneSemesterQuery,
  getAllSemestersQuery,
  getLastSemeterQuery,
  getOneSemeterQuery,
  getSemetersPerYearQuery,
  insertSemesterQuery,
  updateSemesterQuery,
} from 'src/database/queries/semester.query';
import { graphqlError } from 'src/utils';
import { errorMessage } from './message.error';
import {
  createSemesterCheckQuery,
  deleteSemesterCheckQuery,
  updateSemesterCheckQuery,
} from './checkQuery';

@Injectable()
export class SemesterService {
  constructor(private readonly conn: DatabaseService) {}

  /**
   * Retrieves semesters from the system based on filter criteria and pagination.
   * Admins can create, update, or delete semesters.
   *
   * @param semesterFilterInput - The filter criteria for retrieving semesters.
   * @param currentUser - The current user making the request.
   * @returns The list of semesters that match the filter criteria.
   */
  async getSemestersService(
    semesterFilterInput: SemesterFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const page = semesterFilterInput.page || 1;
      const limit = semesterFilterInput.limit || 10;

      const semesters = await this.conn.query(
        getAllSemestersQuery(currentUser.Faculty_ID, {
          ...semesterFilterInput,
          page,
          limit,
        }),
      );

      return semesters.recordset;
    } catch (error) {
      console.log(error);
      graphqlError('Something went wrong, Please try again', '500');
    }
  }

  /**
   * Creates a new semester.
   *
   * @param semesterInput - The input data for creating the semester.
   * @param currentUser - The current user making the request.
   * @returns A success message indicating that the semester was created successfully.
   */
  async createSemestersService(
    semesterInput: SemesterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await Promise.all([
        this.conn.query(getLastSemeterQuery(currentUser.Faculty_ID)),
        this.conn.query(
          getSemetersPerYearQuery(currentUser.Faculty_ID, semesterInput.years),
        ),
      ]);

      createSemesterCheckQuery(resultPromises, semesterInput);

      const semester_ID: string = uuid();

      await this.conn.query(
        insertSemesterQuery({
          semester_ID: semester_ID,
          faculty_ID: currentUser.Faculty_ID,
          ...semesterInput,
        }),
      );

      return 'semester created successfully';
    } catch (error) {
      if (error in errorMessage) {
        const { message, code } = errorMessage[error];
        graphqlError(message, code);
      } else {
        console.log(error);
        graphqlError('Something went wrong, Please try again', '500');
      }
    }
  }

  /**
   * Updates an existing semester.
   *
   * @param updateSemesterInput - The input data for updating the semester.
   * @param currentUser - The current user making the request.
   * @returns A success message indicating that the semester was updated successfully.
   */
  async updateSemesterService(
    updateSemesterInput: UpdateSemesterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { semester_ID, ...updateInput } = updateSemesterInput;

      if (Object.keys(updateInput).length === 0) {
        throw 'ENTER_DATA';
      }

      const semester = await this.conn.query(getOneSemeterQuery(semester_ID));

      updateSemesterCheckQuery(semester, updateSemesterInput, currentUser);

      await this.conn.query(updateSemesterQuery(updateSemesterInput));

      return 'Semester updated successfully';
    } catch (error) {
      if (error in errorMessage) {
        const { message, code } = errorMessage[error];
        graphqlError(message, code);
      } else {
        console.log(error);
        graphqlError('Something went wrong, Please try again', '500');
      }
    }
  }

  /**
   * Deletes an existing semester.
   *
   * @param semester_ID - The ID of the semester to be deleted.
   * @param currentUser - The current user making the request.
   * @returns A success message indicating that the semester was deleted successfully.
   */
  async deleteSemesterService(semester_ID: string, currentUser: CurrentUser) {
    try {
      const semester = await this.conn.query(getOneSemeterQuery(semester_ID));

      deleteSemesterCheckQuery(semester, currentUser);

      await this.conn.query(deleteOneSemesterQuery(semester_ID));

      return 'Semester deleted successfully';
    } catch (error) {
      if (error in errorMessage) {
        const { message, code } = errorMessage[error];
        graphqlError(message, code);
      } else {
        console.log(error);
        graphqlError('Something went wrong, Please try again', '500');
      }
    }
  }
}
