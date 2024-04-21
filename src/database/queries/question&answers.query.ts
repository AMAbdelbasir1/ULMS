export function getOneQuestionQuery(question_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT question_ID,quiz_ID,grade FROM questions WHERE question_ID=@question_ID`,
    params: { question_ID },
  };
}

export function getQuestionsQuery(filterInput: {
  quiz_ID: string;
  page?: number;
  limit?: number;
}): {
  query: string;
  params?: any;
} {
  const offset = (filterInput.page - 1) * filterInput.limit;

  return {
    query: `SELECT Q.question_ID,Q.text as question_text,Q.type,Q.grade,Q.created_at as question_created_at,A.answer_ID,A.text as answer_text,A.is_correct,A.created_at as answer_created_at 
            FROM questions Q 
            LEFT JOIN Question_answers A ON Q.question_ID=A.question_ID
            WHERE quiz_ID=@quiz_ID ORDER BY Q.created_at DESC  
            OFFSET @offset ROWS FETCH FIRST @limit ROWS ONLY`,
    params: { ...filterInput, offset },
  };
}

export function getInstructorQuestionQuery(
  instructor_ID: string,
  question_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT Q.question_ID FROM questions Q JOIN
            quiz q on Q.quiz_ID=q.quiz_ID
            join instructor_course_semester IC on q.course_cycle_ID=IC.course_cycle_ID
            WHERE question_ID=@question_ID AND IC.instructor_ID=@instructor_ID`,
    params: { question_ID, instructor_ID },
  };
}

export function insertQuestionQuery(questionInput: {
  quiz_ID: string;
  question_ID: string;
  text: string;
  type: string;
  grade: number;
}): { query: string; params?: any } {
  return {
    query: `INSERT INTO questions (quiz_ID,question_ID,text,type,grade) 
            VALUES (@quiz_ID,@question_ID,@text,@type,@grade)`,
    params: { ...questionInput },
  };
}

export function insertAnswerQuery(answerInput: {
  question_ID: string;
  answer_ID: string;
  text: string;
  is_correct: boolean;
  type?: string;
  isStudentAnswer?: boolean;
}): { query: string; params?: any } {
  const checkStudentAnswer = answerInput.isStudentAnswer ? '' : 'type';
  const checkTypeCondition = answerInput.isStudentAnswer ? '' : '@type';
  answerInput.type = answerInput.isStudentAnswer
    ? 'questionAnswer'
    : 'studentAnswer';

  return {
    query: `INSERT INTO Question_answers (question_ID,answer_ID,text,is_correct,${checkStudentAnswer}) 
            VALUES (@question_ID,@answer_ID,@text,@is_correct,${checkTypeCondition})`,
    params: { ...answerInput },
  };
}
export function updateQuestionQuery(updateInput: {
  question_ID: string;
  text?: string;
  grade?: number;
}): { query: string; params?: any } {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'question_ID' && updateInput[key],
  );

  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');

  return {
    query: `UPDATE questions SET ${setStatements} WHERE question_ID=@question_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneQuestionQuery(question_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM questions WHERE question_ID=@question_ID;`,
    params: { question_ID },
  };
}

export function deleteOneAnswerQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Question_answers WHERE answer_ID=@answer_ID;`,
    params: { answer_ID },
  };
}

export function deleteAnswersQuery(question_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM Question_answers WHERE question_ID=@question_ID;`,
    params: { question_ID },
  };
}

export function getOneAnswerQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT answer_ID,question_ID,is_correct 
            FROM Question_answers 
            WHERE answer_ID=@answer_ID`,
    params: { answer_ID },
  };
}

export function getAnswersQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT answer_ID,is_correct FROM Question_answers QA 
            JOIN Question_answers Q ON Q.question_ID=QA.question_ID  
             WHERE QA.answer_ID=@answer_ID`,
    params: { answer_ID },
  };
}

export function getOneInstructorQuestionAnswerQuery(
  instructor_ID: string,
  answer_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT QA.instructor_ID FROM Question_answers QA JOIN questions Q ON Q.question_ID=QA.question_ID 
             JION quiz q on Q.quiz_ID=q.quiz_ID
             JOIN instructor_course_semester IC on q.course_cycle_ID=IC.course_cycle_ID
             WHERE answer_ID=@answer_ID AND Q.instructor_ID=@instructor_ID`,
    params: { answer_ID, instructor_ID },
  };
}
export function updateIsCorrectAnswerQuery(question_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `UPDATE Question_answers SET is_correct=1 WHERE question_ID=@question_ID AND is_correct=1;`,
    params: { question_ID },
  };
}
export function updateAnswerQuery(updateInput: {
  answer_ID: string;
  text?: string;
  is_correct?: boolean;
}): { query: string; params?: any } {
  const updateFields = Object.keys(updateInput).filter(
    (key) => key !== 'answer_ID' && updateInput[key],
  );

  const setStatements = updateFields.map((key) => `${key}=@${key}`).join(',');

  return {
    query: `UPDATE Question_answers SET ${setStatements} WHERE answer_ID=@answer_ID;`,
    params: { ...updateInput },
  };
}
