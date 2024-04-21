import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  StudentInformationInput,
  StudentInformationUpdateInput,
} from './student-information.input';
import {
  deleteOneStudentInformationQuery,
  getOneStudentInformationAcademicQuery,
  getOneStudentInformationQuery,
  insertStudentInformationQuery,
  updateStudentInformationQuery,
} from 'src/database/queries/student-information.query';
import { getOneDepartmentQuery } from 'src/database/queries/department.query';
import { StudentInformationValidation } from './student-information.validation';
import { graphqlError } from 'src/utils/graph.error';

@Injectable()
export class StudentInformationService {
  constructor(
    private readonly conn: DatabaseService,
    private readonly studentInformationValidation: StudentInformationValidation,
  ) {}
  /**
   *
   * @param studentInformationInput
   * @returns
   */
  async createStudentInformationService(
    studentInformationInput: StudentInformationInput,
  ) {
    this.studentInformationValidation.validateStudentInformationValidationInput(
      studentInformationInput,
    );
    try {
      const [existingStudent, existingAcademic, existingUser] =
        await Promise.all([
          this.conn.query(
            getOneStudentInformationQuery(studentInformationInput.user_ID),
          ),
          this.conn.query(
            getOneStudentInformationAcademicQuery(
              studentInformationInput.academic_ID,
            ),
          ),
          this.conn.query(
            getOneDepartmentQuery(studentInformationInput.department_ID),
          ),
        ]);
      if (existingAcademic.recordset.length > 0) {
        throw 'EXIST_ACADIMIC';
      }
      if (existingUser.recordset.length == 0) {
        throw 'NOT_EXIST_DEPARTMENT';
      }
      if (existingStudent.recordset.length > 0) {
        throw 'EXIST_STUDENT';
      }

      await this.conn.query(
        insertStudentInformationQuery(studentInformationInput),
      );
      return 'insert successfuly';
    } catch (error) {
      if (error == 'EXIST_ACADIMIC') {
        graphqlError(
          `academic id ${studentInformationInput.academic_ID} assigned to student`,
          '400',
        );
      } else if (error == 'NOT_EXIST_DEPARTMENT') {
        graphqlError('department not found', '404');
      } else if (error == 'EXIST_STUDENT') {
        graphqlError('student has already academic id', '400');
      }
      console.log(error);
      graphqlError('Something went wrong, Please try again', '500');
    }
  }
  /**
   *
   * @param studentInformationUpdateInput
   * @returns
   */
  async updateStudentInformationService(
    studentInformationUpdateInput: StudentInformationUpdateInput,
  ) {
    this.studentInformationValidation.validateStudentInformationUpdateInput(
      studentInformationUpdateInput,
    );
    try {
      const [existingStudent, existingAcademic, existingUser] =
        await Promise.all([
          this.conn.query(
            getOneStudentInformationQuery(
              studentInformationUpdateInput.user_ID,
            ),
          ),
          (async () => {
            if (studentInformationUpdateInput.academic_ID) {
              this.conn.query(
                getOneStudentInformationAcademicQuery(
                  studentInformationUpdateInput.academic_ID,
                ),
              );
            }
            return { recordset: [] };
          })(),
          ,
          (async () => {
            if (studentInformationUpdateInput.department_ID) {
              this.conn.query(
                getOneDepartmentQuery(
                  studentInformationUpdateInput.department_ID,
                ),
              );
            }
            return { recordset: ['found'] };
          })(),
        ]);
      if (existingAcademic.recordset.length > 0) {
        throw 'EXIST_ACADIMIC';
      }
      if (existingUser.recordset.length == 0) {
        throw 'NOT_EXIST_DEPARTMENT';
      }
      if (existingStudent.recordset.length > 0) {
        throw 'EXIST_STUDENT';
      }

      await this.conn.query(
        updateStudentInformationQuery(studentInformationUpdateInput),
      );
      return 'update successfuly';
    } catch (error) {
      if (error == 'EXIST_ACADIMIC') {
        graphqlError(
          `academic id ${studentInformationUpdateInput.academic_ID} assigned to student`,
          '400',
        );
      } else if (error == 'NOT_EXIST_DEPARTMENT') {
        graphqlError('department not found', '404');
      } else if (error == 'EXIST_STUDENT') {
        graphqlError('student has already academic id', '400');
      }
      console.log(error);
      graphqlError('Something went wrong, Please try again', '500');
    }
  }

  /**
   *
   * @param user_ID
   * @returns
   */
  async deleteStudentInformationService(user_ID: string) {
    try {
      const existingStudent = await this.conn.query(
        getOneStudentInformationQuery(user_ID),
      );
      if (existingStudent.recordset.length > 0) {
        throw 'NOT_EXIST_STUDENT';
      }
      await this.conn.query(deleteOneStudentInformationQuery(user_ID));
      return 'deleted successfuly';
    } catch (error) {
      console.log(error);
      graphqlError('Something went wrong, Please try again', '500');
    }
  }
}
