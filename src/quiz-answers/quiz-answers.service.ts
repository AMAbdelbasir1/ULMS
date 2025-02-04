import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  QuizAnswerFilterInput,
  QuizAnswerInput,
  QuizAnswerUpdateInput,
} from './quiz-answers.input';
import { handleError } from '../utils';
import { CurrentUser } from '../user/user.input';
import { errorMessage } from './message.error';
import {
  checkQuestionsAndAnswersPromisesQuery,
  getQuizAnswersPromisesQuery,
  getQuizStudentAnswersPromisesQuery,
  getQuizzesStudentSubmitPromisesQuery,
  submitQuizAnswersPromisesQuery,
  updateQuizAnswersPromisesQuery,
} from './promisesQuery';
import {
  checkQuestionsAndAnswersCheckQuery,
  getQuizAnswersCheckQuery,
  getQuizStudentAnswersCheckQuery,
  getQuizzesStudentSubmitCheckQuery,
  submitQuizAnswersCheckQuery,
  updateQuizAnswersCheckQuery,
} from './checkQuery';
import {
  getAllStudentsSubmitedQuery,
  getStudentCourseQuizzesSubmitQuery,
  getStudentQuizAnswersQuery,
  sumStudentQuizGrade,
  updateStudentQuizAnswerQuery,
  updateStudentQuizSubmit,
} from '../database/queries/quiz_answers.query';
import { getOneQuizQuery } from '../database/queries/quiz.query';
import { ResultQuiz } from './quiz.helper';

@Injectable()
export class QuizAnswersService {
  constructor(private readonly conn: DatabaseService) {}

  /**
   *
   * @param quizAnswerFilterInput
   * @param currentUser
   * @returns
   */
  async getQuizAnswersService(
    quizAnswerFilterInput: QuizAnswerFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getQuizAnswersPromisesQuery(
        quizAnswerFilterInput.quiz_ID,
        currentUser.user_ID,
        this.conn,
      );

      getQuizAnswersCheckQuery(resultPromises, currentUser);
      const page = quizAnswerFilterInput.page || 1;
      const limit = quizAnswerFilterInput.limit || 10;
      const quizResult = await Promise.all([
        this.conn.query(getOneQuizQuery(quizAnswerFilterInput.quiz_ID)),
        this.conn.query(
          getAllStudentsSubmitedQuery({
            ...quizAnswerFilterInput,
            page,
            limit,
          }),
        ),
      ]);

      return {
        quiz_ID: quizResult[0].recordset[0].quiz_ID,
        quiz_name: quizResult[0].recordset[0].title,
        student_answers: quizResult[1].recordset,
        created_at: quizResult[0].recordset[0].created_at,
      };
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /*************************************************************
   *
   * @param submit_ID
   * @param currentUser
   * @returns
   */
  async getQuizStudentAnswersService(
    submit_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getQuizStudentAnswersPromisesQuery(
        submit_ID,
        currentUser,
        this.conn,
      );

      getQuizStudentAnswersCheckQuery(resultPromises, currentUser);

      const quizResult = await Promise.all([
        this.conn.query(
          getOneQuizQuery(resultPromises[0].recordset[0].quiz_ID),
        ),
        this.conn.query(
          getStudentQuizAnswersQuery({
            student_ID: resultPromises[0].recordset[0].student_ID,
            quiz_ID: resultPromises[0].recordset[0].quiz_ID,
          }),
        ),
      ]);
      console.log(quizResult[1]);
      return {
        quiz_ID: quizResult[0].recordset[0].quiz_ID,
        quiz_name: quizResult[0].recordset[0].title,
        answers: quizResult[1].recordset,
      };
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /*************************************************************
   *
   * @param course_cycle_ID
   * @param currentUser
   * @returns
   */
  async getQuizzesStudentSubmitService(
    course_cycle_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getQuizzesStudentSubmitPromisesQuery(
        course_cycle_ID,
        currentUser.user_ID,
        this.conn,
      );

      getQuizzesStudentSubmitCheckQuery(resultPromises);

      const quizzesSubmit = await this.conn.query(
        getStudentCourseQuizzesSubmitQuery(
          currentUser.user_ID,
          course_cycle_ID,
        ),
      );
      return quizzesSubmit.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /******************************************************
   *
   * @param quizAnswerInput
   * @param currentUser
   * @returns
   */
  async submitQuizAnswerService(
    quizAnswerInput: QuizAnswerInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await submitQuizAnswersPromisesQuery(
        quizAnswerInput.quiz_ID,
        currentUser.user_ID,
        this.conn,
      );
      submitQuizAnswersCheckQuery(resultPromises);

      const resultCheckPromises = await checkQuestionsAndAnswersPromisesQuery(
        quizAnswerInput.answers,
        this.conn,
      );

      const hasAnswer = checkQuestionsAndAnswersCheckQuery(
        resultCheckPromises,
        quizAnswerInput.quiz_ID,
      );

      const { queries, ...quizResult } = ResultQuiz(
        resultCheckPromises,
        hasAnswer,
        currentUser,
        quizAnswerInput.quiz_ID,
      );

      await this.conn.executeTransaction(queries);

      return quizResult;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**********************************************************
   *
   * @param quizAnswerUpdateInput
   * @param currentUser
   */
  async updateQuizAnswerService(
    quizAnswerUpdateInput: QuizAnswerUpdateInput[],
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await updateQuizAnswersPromisesQuery(
        quizAnswerUpdateInput,
        currentUser.user_ID,
        this.conn,
      );

      updateQuizAnswersCheckQuery(resultPromises, currentUser);
      const queries = [];

      quizAnswerUpdateInput.map((answer) => {
        queries.push(
          updateStudentQuizAnswerQuery({
            answer_ID: answer.answer_ID,
            grade: answer.grade,
          }),
        );
      });

      const total_grade = await this.conn.query(
        sumStudentQuizGrade(
          resultPromises[0][0].recordset[0].student_ID,
          resultPromises[0][0].recordset[0].quiz_ID,
        ),
      );

      queries.push(
        updateStudentQuizSubmit({
          student_ID: resultPromises[0][0].recordset[0].student_ID,
          quiz_ID: resultPromises[0][0].recordset[0].quiz_ID,
          grade: total_grade.recordset[0].total_grade,
        }),
      );

      await this.conn.executeTransaction(queries);

      return 'Student quiz answers updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
