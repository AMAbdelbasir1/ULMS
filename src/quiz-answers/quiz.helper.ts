import { v4 as uuid } from 'uuid';

import { QueryResult } from 'src/database/database.entity';
import { insertAnswerQuery } from 'src/database/queries/question&answers.query';
import {
  submitQuizAnswerQuery,
  insertStudentQuizSubmit,
} from 'src/database/queries/quiz_answers.query';
import { CurrentUser } from 'src/user/user.input';

/**
 *
 * @param quiz_answers
 * @param hasAnswer
 * @param currentUser
 * @param quiz_ID
 * @returns
 */
export function ResultQuiz(
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
          grade: question.recordset[0].grade as number,
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
