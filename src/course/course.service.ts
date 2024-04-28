import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import {
  CourseFilterInput,
  CourseInput,
  CourseUpdateInput,
} from './course.input';
import {
  deleteOneCourseQuery,
  getAllCourseQuery,
  getCourseByNameQuery,
  getOneCourseQuery,
  insertCourseQuery,
  updateCourseQuery,
} from 'src/database/queries/course.query';
import { deleteFile, handleError, saveImage } from 'src/utils';
import { CurrentUser } from 'src/user/user.input';
import { errorMessage } from './message.error';
import { updateCoursePromisesQuery } from './promisesQuery';
import { deleteCourseCheckQuery, updateCourseCheckQuery } from './checkQuery';

@Injectable()
export class CourseService {
  constructor(private readonly conn: DatabaseService) {}

  async getCoursesService(
    courseFilterInput: CourseFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit } = courseFilterInput;
      page = page || 1; // Default to page 1 if not provided
      limit = limit || 10; // Default to a limit of 10 if not provided
      const Courses = await this.conn.query(
        getAllCourseQuery(page, limit, currentUser.Faculty_ID),
      );
      return Courses.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param courseInput
   * @param currentUser
   * @returns
   */
  async createCourseService(
    courseInput: CourseInput,
    currentUser: CurrentUser,
  ): Promise<string> {
    const { image, ...insertInput } = courseInput;
    let logoPath;

    try {
      const existingCourse = await this.conn.query(
        getCourseByNameQuery(courseInput.name, currentUser.Faculty_ID),
      );

      if (existingCourse.recordset.length > 0) {
        throw 'EXISITS_COURSE';
      }
      logoPath = await saveImage(await image, 'course');
      await this.conn.query(
        insertCourseQuery(
          uuid(),
          { faculty_ID: currentUser.Faculty_ID, ...insertInput },
          logoPath,
        ),
      );
      return 'Course created successfuly';
    } catch (error) {
      if (logoPath) {
        deleteFile('.' + logoPath);
      }
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param courseUpdateInput
   * @param currentUser
   * @returns
   */
  async updateCourseService(
    courseUpdateInput: CourseUpdateInput,
    currentUser: CurrentUser,
  ) {
    let logoPath: string;
    const { image, ...updateInput } = courseUpdateInput;
    try {
      if (Object.keys(updateInput).length === 1 && !(await image)) {
        throw 'ENTER_DATA';
      }

      const resultCoursePromise = await updateCoursePromisesQuery(
        updateInput,
        this.conn,
        currentUser,
      );

      updateCourseCheckQuery(resultCoursePromise, currentUser);

      if (image) {
        logoPath = await saveImage(await image, 'faculty');
      }

      await this.conn.query(
        updateCourseQuery({
          course_ID: updateInput.course_ID,
          ...updateInput,
          image_path: logoPath,
        }),
      );
      return 'update faculty successfuly';
    } catch (error) {
      if (logoPath) {
        deleteFile('.' + logoPath);
      }
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param course_ID
   * @param currentUser
   * @returns
   */
  async deleteCourseService(
    course_ID: string,
    currentUser: CurrentUser,
  ): Promise<string> {
    try {
      const existingCourse = await this.conn.query(
        getOneCourseQuery(course_ID),
      );

      deleteCourseCheckQuery(existingCourse, currentUser);

      await this.conn.query(deleteOneCourseQuery(course_ID));

      deleteFile('.' + existingCourse.recordset[0].image_path);

      return 'Course deleted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
