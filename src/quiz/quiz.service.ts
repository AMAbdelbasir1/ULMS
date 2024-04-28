import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { QuizFilterInput, QuizInput, QuizUpdateInput } from './quiz.input';
import { CurrentUser } from '../user/user.input';
import {
  creatQuizPromisesQuery,
  getQuizzesPromisesQuery,
  updateQuizPromisesQuery,
} from './promisesQuery';
import {
  createQuizCheckQuery,
  getQuizzesCheckQuery,
  updateQuizCheckQuery,
} from './checkQuery';
import { handleError } from '../utils';
import { errorMessage } from './message.error';
import {
  deleteOneQuizQuery,
  getCourseQuizzesQuery,
  getInstructorCoursesQuizzesQuery,
  getStudentCoursesQuizzesQuery,
  insertQuizQuery,
  updateQuizQuery,
} from '../database/queries/quiz.query';

@Injectable()
export class QuizService {
  constructor(private readonly conn: DatabaseService) {}

  /**
   *
   * @param quizFilterInput
   * @param currentUser
   * @returns
   */
  async getQuizzesService(
    quizFilterInput: QuizFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const page = quizFilterInput.page || 1;
      const limit = quizFilterInput.limit || 10;
      if (quizFilterInput.course_cycle_ID) {
        const resultPromises = await getQuizzesPromisesQuery(
          quizFilterInput.course_cycle_ID,
          currentUser,
          this.conn,
        );
        getQuizzesCheckQuery(
          resultPromises,
          currentUser,
          quizFilterInput.course_cycle_ID,
        );
        const result = await this.conn.query(
          getCourseQuizzesQuery({ ...quizFilterInput, page, limit }),
        );
        return result.recordset;
      } else if (!currentUser.roles.includes('STUDENT')) {
        const result = await this.conn.query(
          getInstructorCoursesQuizzesQuery({
            ...quizFilterInput,
            user_ID: currentUser.user_ID,
            page,
            limit,
          }),
        );
        return result.recordset;
      } else {
        const result = await this.conn.query(
          getStudentCoursesQuizzesQuery({
            ...quizFilterInput,
            user_ID: currentUser.user_ID,
            page,
            limit,
          }),
        );
        return result.recordset;
      }
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param quizInput
   * @param currentUser
   * @returns
   */
  async createQuizService(quizInput: QuizInput, currentUser: CurrentUser) {
    try {
      const resultPromises = await creatQuizPromisesQuery(
        quizInput.course_cycle_ID,
        currentUser.user_ID,
        this.conn,
      );

      createQuizCheckQuery(resultPromises, {
        start_Date: new Date(quizInput.start_Date),
        end_Date: new Date(quizInput.end_Date),
      });

      await this.conn.query(
        insertQuizQuery({
          ...quizInput,
          quiz_ID: uuid(),
          instructor_ID: currentUser.user_ID,
        }),
      );

      return 'Quiz created successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async updateQuizService(
    quizUpdateInput: QuizUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await updateQuizPromisesQuery(
        quizUpdateInput.quiz_ID,
        currentUser,
        this.conn,
      );

      updateQuizCheckQuery(resultPromises, currentUser, {
        start_Date: new Date(quizUpdateInput.start_Date),
        end_Date: new Date(quizUpdateInput.end_Date),
      });

      await this.conn.query(updateQuizQuery(quizUpdateInput));

      return 'Quiz updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async deleteQuizService(quizID: string, currentUser: CurrentUser) {
    try {
      const resultPromises = await updateQuizPromisesQuery(
        quizID,
        currentUser,
        this.conn,
      );
      updateQuizCheckQuery(resultPromises, currentUser, null);

      await this.conn.query(deleteOneQuizQuery(quizID));
      return 'Quiz deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
