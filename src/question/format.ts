interface QuestionRecord {
  question_ID: string;
  question_text: string;
  type: string;
  grade: number;
  answer_ID: string;
  answer_text: string;
  is_correct: boolean;
  question_created_at: Date;
  answer_created_at: Date;
}

interface Answer {
  answer_ID: string;
  text: string;
  is_correct: boolean;
  answer_created_at: Date;
}

interface Question {
  question_ID: string;
  text: string;
  type: string;
  grade: number;
  question_created_at: Date;
}

export interface formattedQuestion {
  question_ID: string;
  text: string;
  type: string;
  grade: number;
  answers: {
    answer_ID: string;
    text: string;
    is_correct: boolean;
  }[];
}
export function formatQuestionsWithAnswer(questions: QuestionRecord[]): formattedQuestion[] {
  const formattedQuestions: formattedQuestion[] = [];

  const questionMap = new Map<
    string,
    { question: Question; answers: Answer[] }
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
