import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from '../database/database.service';
import {
  AnswerUpdateInput,
  QuestionFilterInput,
  QuestionInput,
  QuestionUpdateInput,
} from './question.input';
import { CurrentUser } from '../user/user.input';
import {
  getQuestionsPromisesQuery,
  insertQuestionsPromisesQuery,
  updateAnswerPromisesQuery,
  updateQuestionsPromisesQuery,
} from './promisesQuery';
import {
  deleteAnswerCheckQuery,
  getQuestionsCheckQuery,
  insertQuestionsCheckQuery,
  updateAnswerCheckQuery,
  updateQuestionsCheckQuery,
} from './checkQuery';
import { errorMessage } from './message.error';
import { handleError } from '../utils';
import {
  deleteAnswersQuery,
  deleteOneAnswerQuery,
  deleteOneQuestionQuery,
  getQuestionsAndAnswerQuery,
  insertAnswerQuery,
  insertQuestionQuery,
  updateAnswerQuery,
  updateIsCorrectAnswerQuery,
  updateQuestionQuery,
} from '../database/queries/question&answers.query';
import { updateQuizQuery } from '../database/queries/quiz.query';
import { updateGradeQuizAnswer } from '../database/queries/quiz_answers.query';
import { formatQuestionsWithAnswer } from './format';

@Injectable()
export class QuestionService {
  constructor(private readonly conn: DatabaseService) {}

  async getQuestionsService(
    filterInput: QuestionFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getQuestionsPromisesQuery(
        filterInput.quiz_ID,
        currentUser,
        this.conn,
      );

      getQuestionsCheckQuery(resultPromises, currentUser);

      const page = filterInput.page || 1;
      const limit = filterInput.limit || 10;
      const result = await this.conn.query(
        getQuestionsAndAnswerQuery({
          quiz_ID: filterInput.quiz_ID,
          page,
          limit,
        }),
      );

      const formattedQuestion = formatQuestionsWithAnswer(result.recordset);

      return formattedQuestion;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   *
   * @param questionsInput
   * @param currentUser
   * @returns
   */
  async insertQuestionsService(
    questionsInput: { quiz_ID: string; questions: QuestionInput[] },
    currentUser: CurrentUser,
  ) {
    try {
      const { quiz_ID, questions } = questionsInput;

      const resultPromises = await insertQuestionsPromisesQuery(
        quiz_ID,
        currentUser.user_ID,
        this.conn,
      );

      insertQuestionsCheckQuery(resultPromises);

      const quires = [];
      let total_quiz_grade = 0;
      questions.map((question) => {
        const question_UID = uuid();
        total_quiz_grade += question.grade;
        quires.push(
          insertQuestionQuery({
            text: question.text,
            type: question.type,
            grade: question.grade,
            question_ID: question_UID,
            quiz_ID: quiz_ID,
          }),
        );
        question.answers.map((answer) => {
          quires.push(
            insertAnswerQuery({
              question_ID: question_UID,
              answer_ID: uuid(),
              ...answer,
            }),
          );
        });
      });

      quires.push(updateQuizQuery({ quiz_ID, grade: total_quiz_grade }));

      await this.conn.executeTransaction(quires);

      return 'Questions inserted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   *
   * @param updateQuestionInput
   * @param currentUser
   * @returns
   */
  async updateQuestionService(
    updateQuestionInput: QuestionUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      if (Object.keys(updateQuestionInput).length <= 1) {
        throw 'ENTER_DATA';
      }

      const resultPromises = await updateQuestionsPromisesQuery(
        updateQuestionInput.question_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateQuestionsCheckQuery(resultPromises, currentUser);

      if (updateQuestionInput.grade) {
        const queries = [];
        const total_quiz_grade =
          updateQuestionInput.grade + resultPromises[2].recordset[0].grade;

        queries.push(updateQuestionQuery(updateQuestionInput));

        queries.push(
          updateQuizQuery({
            quiz_ID: resultPromises[0].recordset[0].quiz_ID,
            grade: total_quiz_grade,
          }),
        );

        if (resultPromises[0].recordset[0].type !== 'answer') {
          queries.push(
            updateGradeQuizAnswer(
              updateQuestionInput.question_ID,
              updateQuestionInput.grade,
            ),
          );
        }

        await this.conn.executeTransaction(queries);
      } else {
        await this.conn.query(updateQuestionQuery(updateQuestionInput));
      }

      return 'Question updated successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   *
   * @param question_ID
   * @param currentUser
   * @returns
   */
  async deleteQuestionService(question_ID: string, currentUser: CurrentUser) {
    try {
      const resultPromises = await updateQuestionsPromisesQuery(
        question_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateQuestionsCheckQuery(resultPromises, currentUser);

      await this.conn.executeTransaction([
        deleteAnswersQuery(question_ID),
        deleteOneQuestionQuery(question_ID),
      ]);

      return 'Question deleted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param answerInput
   * @param currentUser
   * @returns
   */
  async updateAnswerService(
    answerInput: AnswerUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await updateAnswerPromisesQuery(
        answerInput.answer_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateAnswerCheckQuery(
        resultPromises,
        currentUser,
        answerInput.is_correct.toString() === 'true' ? 1 : 0,
      );

      await this.conn.executeTransaction([
        updateIsCorrectAnswerQuery(resultPromises[0].recordset[0].question_ID),
        updateAnswerQuery(answerInput),
      ]);

      return 'Answer updated successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param answer_ID
   * @param currentUser
   * @returns
   */
  async deleteAnswerService(answer_ID: string, currentUser: CurrentUser) {
    try {
      const resultPromises = await updateAnswerPromisesQuery(
        answer_ID,
        currentUser.user_ID,
        this.conn,
      );

      deleteAnswerCheckQuery(resultPromises, currentUser);

      await this.conn.query(deleteOneAnswerQuery(answer_ID));

      return 'Answer deleted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
