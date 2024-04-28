import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
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
import { QueryResult } from '../database/database.entity';
import {
  getAllStudentsSubmitedQuery,
  getStudentCourseQuizzesSubmitQuery,
  getStudentQuizAnswersQuery,
  insertStudentQuizSubmit,
  submitQuizAnswerQuery,
  sumStudentQuizGrade,
  updateStudentQuizAnswerQuery,
  updateStudentQuizSubmit,
} from '../database/queries/quiz_answers.query';
import { insertAnswerQuery } from '../database/queries/question&answers.query';
import { getOneQuizQuery } from '../database/queries/quiz.query';

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

      const { queries, ...quizResult } = this.ResultQuiz(
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

  /***************************************************
   *
   * @param quiz_answers
   * @param hasAnswer
   * @param currentUser
   * @param quiz_ID
   * @returns
   */
  private ResultQuiz(
    quiz_answers: [QueryResult, QueryResult][],
    hasAnswer: boolean,
    currentUser: CurrentUser,
    quiz_ID: string,
  ) {
    let grade = hasAnswer ? null : 0;
    const queries = [];
    const answers: {
      question_ID: string;
      answer_ID: string;
      is_correct: number;
    }[] = [];
    quiz_answers.map(([question, answer]) => {
      if (question.recordset[0].type == 'answer') {
        const answer_UID = uuid();
        queries.push(
          insertAnswerQuery({
            answer_ID: answer_UID,
            question_ID: question.recordset[0].question_ID as string,
            isStudentAnswer: true,
            text: answer.recordset[0].text as string,
            is_correct: false,
          }),
        );
        queries.push(
          submitQuizAnswerQuery({
            question_answers_ID: answer_UID,
            answer_ID: uuid(),
            student_ID: currentUser.user_ID,
            grade: null,
          }),
        );
      } else {
        queries.push(
          submitQuizAnswerQuery({
            question_answers_ID: answer.recordset[0].answer_ID as string,
            answer_ID: uuid(),
            student_ID: currentUser.user_ID,
            grade: 0,
          }),
        );
      }
      if (!hasAnswer) {
        if (answer.recordset[0].is_correct === true) {
          grade += question.recordset[0].grade as number;
        }

        answers.push({
          question_ID: question.recordset[0].question_ID as string,
          answer_ID: answer.recordset[0].answer_ID as string,
          is_correct: answer.recordset[0].is_correct as number,
        });
      }
    });

    queries.push(
      insertStudentQuizSubmit({
        submit_ID: uuid(),
        quiz_ID: quiz_ID,
        student_ID: currentUser.user_ID,
        grade: grade,
      }),
    );

    return {
      grade: grade,
      answers,
      queries,
    };
  }
}
