import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CurrentUser } from 'src/user/user.input';
import {
  DeleteStudentEnrolmentInput,
  StudentEnrolmentInput,
} from './student-enrolment.input';
import { getSemesterCourseQuery } from 'src/database/queries/course-semester.query';
import {
  deleteStudentEnrolmentQuery,
  getStudentsEnrolmentQuery,
  insertStudentEnrolmentQuery,
} from 'src/database/queries/student-enrolment.query';
import { handleError } from 'src/utils';
import { errorMessage } from './message.error';
import {
  createStudentsEnrolmentPromisesQuery,
  deleteStudentsEnrolmentPromisesQuery,
  getStudentsEnrolmentPromisesQuery,
} from './promisesQuery';
import {
  createStudentsEnrolmentCheckQuery,
  deleteStudentsEnrolmentCheckQuery,
  getStudentsEnrolmentCheckQuery,
  studentsEnrolmentCheckQuery,
} from './checkQuery';

@Injectable()
export class StudentEnrolmentService {
  constructor(private readonly conn: DatabaseService) {}

  async getStudentsEnrolmentService(
    course_cycle_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getStudentsEnrolmentPromisesQuery(
        course_cycle_ID,
        this.conn,
        currentUser,
      );

      getStudentsEnrolmentCheckQuery(resultPromises, currentUser);

      const students = await this.conn.query(
        getStudentsEnrolmentQuery(course_cycle_ID),
      );
      return students.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param studentEnrolmentInput
   * @param currentUser
   * @returns
   */
  async createStudentEnrolmentService(
    studentEnrolmentInput: StudentEnrolmentInput,
    currentUser: CurrentUser,
  ) {
    try {
      const existingCourse = await this.conn.query(
        getSemesterCourseQuery(studentEnrolmentInput.course_cycle_ID),
      );

      createStudentsEnrolmentCheckQuery(existingCourse, currentUser);

      const [existingUser] = await createStudentsEnrolmentPromisesQuery(
        studentEnrolmentInput,
        this.conn,
      );

      studentsEnrolmentCheckQuery(existingUser, currentUser);

      const insertStudentsQueries = studentEnrolmentInput.students_ID.map(
        (student_ID) =>
          insertStudentEnrolmentQuery({
            student_ID,
            course_cycle_ID: studentEnrolmentInput.course_cycle_ID,
          }),
      );

      await this.conn.executeTransaction(insertStudentsQueries);

      return 'Students enroled successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param deleteStudentEnrolmentInput
   * @param currentUser
   */
  async deleteStudentEnrolmentService(
    deleteStudentEnrolmentInput: DeleteStudentEnrolmentInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { student_ID, course_cycle_ID } = deleteStudentEnrolmentInput;

      const resultPromises = await deleteStudentsEnrolmentPromisesQuery(
        deleteStudentEnrolmentInput,
        this.conn,
      );

      deleteStudentsEnrolmentCheckQuery(resultPromises, currentUser);

      const affected = await this.conn.query(
        deleteStudentEnrolmentQuery(student_ID, course_cycle_ID),
      );
      console.log(affected.rowsAffected);
      return 'Student deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
