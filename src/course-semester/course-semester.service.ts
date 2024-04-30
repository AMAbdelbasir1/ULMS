import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { CurrentUser } from '../user/user.input';
import {
  CourseSemesterFilterInput,
  CourseSemesterInput,
  CourseSemesterUpdateInput,
} from './course-semester.input';
import { handleError } from '../utils';
import {
  deleteOneSemesterCourseQuery,
  getInstructorSemesterCoursesQuery,
  getOneSemesterCourseQuery,
  getSemesterCourseQuery,
  getSemesterCoursesQuery,
  getStudentSemesterCoursesQuery,
  insertSemesterCourseQuery,
  updateSemesterCourseQuery,
} from '../database/queries/course-semester.query';
import {
  getLastSemeterQuery,
  getOneSemeterQuery,
} from '../database/queries/semester.query';
import { errorMessage } from './message.error';
import { getOneCourseQuery } from '../database/queries/course.query';

@Injectable()
export class CourseSemesterService {
  constructor(private readonly conn: DatabaseService) {}
  /**
   *
   * @param courseSemesterFilterInput
   * @param currentUser
   * @returns
   */
  async getSemesterCoursesService(
    courseSemesterFilterInput: CourseSemesterFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const existingSemester = await this.conn.query(
        getOneSemeterQuery(courseSemesterFilterInput.semester_ID),
      );

      if (existingSemester.recordset.length == 0) {
        throw 'SEMESTER_NOT_FOUND';
      }

      if (existingSemester.recordset[0].faculty_ID !== currentUser.Faculty_ID) {
        throw 'UNAUTHORIZED';
      }

      const page = courseSemesterFilterInput.page || 1;
      const limit = courseSemesterFilterInput.limit || 10;

      // eslint-disable-next-line prefer-const
      let { semester_ID, asInstructor } = courseSemesterFilterInput;

      const isInstructor = currentUser.roles.some(
        (ins) => ins == 'DOCTOR' || ins == 'ASSISTANT',
      );

      asInstructor = isInstructor ? asInstructor : false;

      let query;
      if (currentUser.roles.includes('ADMIN') && !asInstructor) {
        query = getSemesterCoursesQuery(semester_ID, page, limit);
      } else if (isInstructor) {
        query = getInstructorSemesterCoursesQuery(
          semester_ID,
          currentUser.user_ID,
        );
      }

      const courses = await this.conn.query(query);
      return courses.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   *
   * @param currentUser
   * @returns
   */
  async getRuningSemesterCoursesService(
    currentUser: CurrentUser,
    asInstructor: boolean,
  ) {
    try {
      const runningSemester = await this.conn.query(
        getLastSemeterQuery(currentUser.Faculty_ID),
      );

      if (
        runningSemester.recordset.length == 0 ||
        runningSemester.recordset[0].end_Date < new Date() ||
        runningSemester.recordset[0].start_Date > new Date()
      ) {
        throw 'SEMESTER_NOT_RUNNING';
      }

      const semester_ID = runningSemester.recordset[0].semester_ID;

      const isInstructor = currentUser.roles.some(
        (ins) => ins == 'DOCTOR' || ins == 'ASSISTANT',
      );

      asInstructor = isInstructor ? asInstructor : false;

      let query;
      if (currentUser.roles.includes('ADMIN') && !asInstructor) {
        query = getSemesterCoursesQuery(semester_ID, 1, 30);
      } else if (isInstructor) {
        query = getInstructorSemesterCoursesQuery(
          semester_ID,
          currentUser.user_ID,
        );
      } else {
        query = getStudentSemesterCoursesQuery(
          semester_ID,
          currentUser.user_ID,
        );
      }

      const courses = await this.conn.query(query);

      return courses.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param courseSemesterInput
   * @param currentUser
   * @returns
   */
  async createCourseSemestersService(
    courseSemesterInput: CourseSemesterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const runningSemester = await this.conn.query(
        getLastSemeterQuery(currentUser.Faculty_ID),
      );
      if (
        runningSemester.recordset.length == 0 ||
        runningSemester.recordset[0].end_Date < new Date()
      ) {
        throw 'SEMESTER_NOT_RUNNING';
      }
      // Check if courses exist in parallel
      const existingCoursesPromises = courseSemesterInput.courses_ID.map(
        (course) => this.conn.query(getOneCourseQuery(course)),
      );
      const existingCourses = await Promise.all(existingCoursesPromises);

      // Validate if any course is not found
      existingCourses.forEach((course) => {
        console.log(currentUser.Faculty_ID);
        if (
          !course.recordset[0] ||
          course.recordset[0].Faculty_ID !== currentUser.Faculty_ID
        ) {
          throw 'COURSE_NOT_FOUND';
        }
      });
      // Construct queries for inserting course semesters
      const insertCourseQueries = courseSemesterInput.courses_ID.map((course) =>
        insertSemesterCourseQuery(
          uuid(),
          course,
          runningSemester.recordset[0].semester_ID,
        ),
      );

      // Execute queries within a transaction
      await this.conn.executeTransaction(insertCourseQueries);

      return 'course created successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param updateCourseSemester
   * @param currentUser
   * @returns
   */
  async updateCourseSemesterService(
    updateCourseSemester: CourseSemesterUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      if (!updateCourseSemester.course_ID) {
        throw 'ENTER_DATA';
      }
      const [existingCourseCycle, existingSemester] = await Promise.all([
        this.conn.query(
          getOneSemesterCourseQuery(updateCourseSemester.cycle_ID),
        ),
        this.conn.query(getSemesterCourseQuery(updateCourseSemester.cycle_ID)),
      ]);
      if (existingCourseCycle.recordset.length == 0) {
        throw 'CYCLE_NOT_FOUND';
      }
      if (existingSemester.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
        throw 'UNAUTHORIZED';
      }
      await this.conn.query(updateSemesterCourseQuery(updateCourseSemester));
      return 'course updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param cycle_ID
   * @param currentUser
   * @returns
   */
  async deleteCourseSemesterService(
    cycle_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const [existingCourseCycle, existingSemester] = await Promise.all([
        this.conn.query(getOneSemesterCourseQuery(cycle_ID)),
        this.conn.query(getSemesterCourseQuery(cycle_ID)),
      ]);
      if (existingCourseCycle.recordset.length == 0) {
        throw 'CYCLE_NOT_FOUND';
      }
      if (existingSemester.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
        throw 'UNAUTHORIZED';
      }
      await this.conn.query(deleteOneSemesterCourseQuery(cycle_ID));
      return 'course updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
