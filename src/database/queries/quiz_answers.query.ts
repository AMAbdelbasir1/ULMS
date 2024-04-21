export function getOneQuizAnswerQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT answer_ID FROM quiz_answers WHERE answer_ID=@answer_ID`,
    params: { answer_ID },
  };
}

export function getStudentQuizAnswersQuery(input: {
  student_ID: string;
  quiz_ID: string;
}): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT QA.question_answers_ID,QZ.question_ID,Q.text as question_text,
            Q.type,QA.answer_ID,QZ.text as answer_text,QZ.is_correct,QA.created_at FROM quiz_answers QA 
            JOIN question_answers QZ ON QA.question_answers_ID=QZ.answer_ID 
            JOIN questions Q ON Q.question_ID=QZ.question_ID
            WHERE QA.student_ID=@student_ID AND Q.quiz_ID=@quiz_ID
            ORDER BY QA.created_at DESC`,
    params: { ...input },
  };
}

export function getOneSubmitQuery(submit_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT submit_ID,quiz_ID,student_ID FROM Student_Quiz_Submit WHERE submit_ID=@submit_ID`,
    params: { submit_ID },
  };
}

export function getOneStudentSubmitQuery(
  student_ID: string,
  quiz_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT quiz_ID,student_ID FROM Student_Quiz_Submit WHERE student_ID=@student_ID AND quiz_ID=@quiz_ID`,
    params: { student_ID, quiz_ID },
  };
}

export function getStudentCourseQuizzesSubmitQuery(
  student_ID: string,
  course_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT Q.quiz_ID,Q.title as quiz_name,SQ.submit_ID,SQ.grade,SQ.created_at 
            FROM Student_Quiz_Submit SQ
            JOIN quiz Q ON Q.quiz_ID=SQ.quiz_ID
            WHERE SQ.student_ID=@student_ID AND Q.course_cycle_ID=@course_ID
            ORDER BY SQ.created_at DESC`,
    params: { student_ID, course_ID },
  };
}

export function getInstructorSubmitQuery(
  instructor_ID: string,
  submit_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT submit_ID FROM Student_Quiz_Submit QA 
            JOIN quiz Q ON Q.quiz_ID=QA.quiz_ID
            JOIN Course_semester CC ON CC.cycle_ID=Q.course_cycle_ID
            JOIN instructor_course_semester IC ON IC.course_cycle_ID=CC.cycle_ID
            WHERE QA.submit_ID=@submit_ID AND IC.instructor_ID=@instructor_ID`,
    params: { submit_ID, instructor_ID },
  };
}

export function submitQuizAnswerQuery(answerInput: {
  student_ID: string;
  question_answers_ID: string;
  answer_ID: string;
  grade: number;
}): {
  query: string;
  params?: any;
} {
  return {
    query: `INSERT INTO quiz_answers (student_ID,question_answers_ID,answer_ID) 
            VALUES (@student_ID,@question_answers_ID,@answer_ID)`,
    params: { ...answerInput },
  };
}

export function getAllStudentsSubmitedQuery(filterInput: {
  quiz_ID: string;
  page?: number;
  limit?: number;
}) {
  const offset = (filterInput.page - 1) * filterInput.limit;
  return {
    query: `SELECT SQ.submit_ID, SQ.student_ID,U.full_name as student_name ,SQ.grade,SQ.created_at 
            FROM Student_Quiz_Submit SQ 
            JOIN users U ON SQ.student_ID=U.user_ID
            WHERE quiz_ID=@quiz_ID ORDER BY SQ.created_at DESC 
            OFFSET @offset ROWS FETCH FIRST @limit ROWS ONLY`,
    params: { ...filterInput, offset },
  };
}

export function insertStudentQuizSubmit(sudentInput: {
  submit_ID: string;
  quiz_ID: string;
  student_ID: string;
  grade: number;
}) {
  return {
    query: `INSERT INTO Student_Quiz_Submit (submit_ID,quiz_ID,student_ID,grade) 
            VALUES (@submit_ID,@quiz_ID,@student_ID,@grade) 
            `,
    params: { ...sudentInput },
  };
}

export function updateStudentQuizSubmit(updateInput: {
  student_ID: string;
  quiz_ID: string;
  grade: number;
}): {
  query: string;
  params?: any;
} {
  return {
    query: `UPDATE Student_Quiz_Submit SET grade=@grade WHERE student_ID=@student_ID AND quiz_ID=@quiz_ID`,
    params: { ...updateInput },
  };
}

export function getOneStudentQuizAnswerQuery(answer_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT QS.answer_ID FROM Quiz_answers
            WHERE answer_ID=@answer_ID`,
    params: { answer_ID },
  };
}

export function getOneInstructorQuizAnswerQuery(
  instructor_ID: string,
  answer_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT QS.answer_ID,QZ.quiz_ID,Q.type FROM Quiz_answers QS 
            JOIN Question_answers QA ON QA.question_answer_ID=QS.answer_ID
            JOIN questions Q ON Q.question_ID=QA.question_ID 
            JOIN quiz QZ ON QZ.quiz_ID=Q.quiz_ID
            JOIN course_cycle CC ON CC.course_cycle_ID=QZ.course_cycle_ID
            JOIN instructor_course_semester IC ON IC.course_cycle_ID=CC.course_cycle_ID
            WHERE QS.answer_ID=@answer_ID AND IC.instructor_ID=@instructor_ID`,
    params: { answer_ID, instructor_ID },
  };
}

export function getAllEssayStudentAnswersQuery(input: {
  student_ID: string;
  quiz_ID: string;
}): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT QA.question_answer_ID,QA.question_ID,QA.answer_ID,QA.created_at 
            FROM quiz_answers QA JOIN question_answers QZ ON QA.question_answer_ID=QA.answer_ID 
            JOIN questions Q ON Q.question_ID=QA.question_ID JOIN quiz QZ ON QZ.quiz_ID=Q quiz_ID
            WHERE QA.student_ID=@student_ID AND QZ.quiz_ID=@quiz_ID
            ORDER BY QA.created_at DESC`,
    params: { ...input },
  };
}

export function updateStudentQuizAnswerQuery(updateInput: {
  answer_ID: string;
  grade: number;
}): { query: string; params?: any } {
  return {
    query: `UPDATE quiz_answers SET grade=@grade WHERE answer_ID=@answer_ID`,
    params: { ...updateInput },
  };
}

export function sumStudentQuizGrade(
  student_ID: string,
  quiz_ID: string,
): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT SUM(grade) as total_grade FROM quiz_answers WHERE student_ID=@student_ID AND quiz_ID=@quiz_ID`,
    params: { student_ID, quiz_ID },
  };
}
