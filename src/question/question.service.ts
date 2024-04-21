import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import {
  AnswerUpdateInput,
  QuestionFilterInput,
  QuestionInput,
  QuestionUpdateInput,
} from './question.input';
import { CurrentUser } from 'src/user/user.input';
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
import { handleError } from 'src/utils';
import {
  deleteAnswersQuery,
  deleteOneAnswerQuery,
  deleteOneQuestionQuery,
  getQuestionsQuery,
  insertAnswerQuery,
  insertQuestionQuery,
  updateAnswerQuery,
  updateIsCorrectAnswerQuery,
  updateQuestionQuery,
} from 'src/database/queries/question&answers.query';

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
        getQuestionsQuery({
          quiz_ID: filterInput.quiz_ID,
          page,
          limit,
        }),
      );

      return this.formatQuestions(result.recordset);
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

      questions.map((question) => {
        const question_UID = uuid();
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

        // return quires;
      });

      console.log(quires);

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

      await this.conn.query(updateQuestionQuery(updateQuestionInput));

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
  /**
   *
   * @param questions
   * @returns
   */
  private async formatQuestions(
    questions: {
      question_ID: string;
      question_text: string;
      type: string;
      grade: number;
      answer_ID: string;
      answer_text: string;
      is_correct: boolean;
      question_created_at: Date;
      answer_created_at: Date;
    }[],
  ) {
    const formattedQuestions: {
      question_ID: string;
      text: string;
      type: string;
      grade: number;
      answers: {
        answer_ID: string;
        text: string;
        is_correct: boolean;
      }[];
    }[] = [];

    const questionMap = new Map<
      string,
      {
        question: {
          question_ID: string;
          text: string;
          type: string;
          grade: number;
          question_created_at: Date;
        };
        answers: {
          answer_ID: string;
          text: string;
          is_correct: boolean;
          answer_created_at: Date;
        }[];
      }
    >();

    questions.forEach((question) => {
      if (!questionMap.has(question.question_ID)) {
        questionMap.set(question.question_ID, {
          question: {
            question_ID: question.question_ID,
            text: question.question_text,
            type: question.type,
            grade: question.grade,
            question_created_at: question.question_created_at,
          },
          answers: [],
        });
      }

      if (question.type !== 'answer') {
        questionMap.get(question.question_ID).answers.push({
          answer_ID: question.answer_ID,
          text: question.answer_text,
          is_correct: question.is_correct,
          answer_created_at: question.answer_created_at,
        });
      }
    });

    questionMap.forEach((value) => {
      formattedQuestions.push({ ...value.question, answers: value.answers });
    });

    return formattedQuestions;
  }
}
