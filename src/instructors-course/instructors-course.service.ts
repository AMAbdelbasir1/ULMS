import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CurrentUser } from '../user/user.input';
import {
  createInstructorsCourseCheckQuery,
  deleteInstructorCourseCheckQuery,
  getInstructorsCourseCheckQuery,
  instructorsCourseCheckQuery,
} from './checkQuery';
import {
  createInstructorsCoursePromisesQuery,
  deleteInstructorCoursePromisesQuery,
  getInstructorsCoursePromisesQuery,
} from './promisesQuery';
import {
  deleteInstructorCourseQuery,
  getInstructorsCourseQuery,
  insertInstructorCourseQuery,
} from '../database/queries/instructor-course.query';
import { handleError } from '../utils/graph.error';
import { errorMessage } from './message.error';
import { getSemesterCourseQuery } from '../database/queries/course-semester.query';
import {
  DeleteInstructorCourseInput,
  InstructorsCourseInput,
} from './instructors-course.input';

@Injectable()
export class InstructorsCourseService {
  constructor(private readonly conn: DatabaseService) {}

  private transformInstructors(instructors: any[]): any[] {
    const transformedUsers = [];

    for (const instructor of instructors) {
      const userId = instructor.instructor_ID;
      const role = instructor.roles; // Assuming `roles` is a string representing the role

      if (role === 'DOCTOR' || role === 'ASSISTANT') {
        const transformedUser = {
          instructor_ID: userId,
          full_name: instructor.full_name,
          email: instructor.email,
          image_path: instructor.image_path,
          role: role, // Assigning the role as a string
        };

        transformedUsers.push(transformedUser);
      }
    }

    return transformedUsers;
  }
  /**
   *
   * @param course_cycle_ID
   * @param currentUser
   * @returns
   */
  async getInstructorsCourseService(
    course_cycle_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getInstructorsCoursePromisesQuery(
        course_cycle_ID,
        this.conn,
        currentUser,
      );

      getInstructorsCourseCheckQuery(resultPromises, currentUser);

      const instructors = await this.conn.query(
        getInstructorsCourseQuery(course_cycle_ID),
      );

      if (
        !currentUser.roles.includes('STUDENT') &&
        !currentUser.roles.includes('ADMIN')
      ) {
        const isCurrentUserInstructor = instructors.recordset.some(
          (ins) => ins.instructor_ID === currentUser.user_ID,
        );

        if (!isCurrentUserInstructor) {
          throw 'UNAUTHORIZED';
        }
      }

      return this.transformInstructors(instructors.recordset);
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   *
   * @param instructorsCourseInput
   * @param currentUser
   * @returns
   */
  async createInstructorsCourseService(
    instructorsCourseInput: InstructorsCourseInput,
    currentUser: CurrentUser,
  ) {
    try {
      const existingCourse = await this.conn.query(
        getSemesterCourseQuery(instructorsCourseInput.course_cycle_ID),
      );

      createInstructorsCourseCheckQuery(existingCourse, currentUser);

      const [existingUser] = await createInstructorsCoursePromisesQuery(
        instructorsCourseInput,
        this.conn,
      );

      instructorsCourseCheckQuery(existingUser, currentUser);

      const insertInstructorsQueries =
        instructorsCourseInput.instructors_ID.map((instructor_ID) =>
          insertInstructorCourseQuery({
            instructor_ID,
            course_cycle_ID: instructorsCourseInput.course_cycle_ID,
          }),
        );

      await this.conn.executeTransaction(insertInstructorsQueries);

      return 'Instructors enroled successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param deleteInstructorCourseInput
   * @param currentUser
   * @returns
   */
  async deleteInstructorCourseService(
    deleteInstructorCourseInput: DeleteInstructorCourseInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { instructor_ID, course_cycle_ID } = deleteInstructorCourseInput;

      const resultPromises = await deleteInstructorCoursePromisesQuery(
        deleteInstructorCourseInput,
        this.conn,
      );

      deleteInstructorCourseCheckQuery(resultPromises, currentUser);

      await this.conn.query(
        deleteInstructorCourseQuery(instructor_ID, course_cycle_ID),
      );
      return 'Instructor deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
