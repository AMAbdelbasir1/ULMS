import { ErrorMessage } from '../utils';

export const errorMessage: ErrorMessage = {
  QUIZ_NOT_FOUND: { message: 'Quiz not found.', code: '404' },
  ENTER_DATA: { message: 'Data missing', code: '400' },
  UNAUTHORIZED: { message: 'Can not apply this operation', code: '401' },
  INVALID_DATA: { message: 'Data that entered not valid', code: '400' },
  QUIZ_NOT_RUNNING: { message: 'Quiz not running', code: '404' },
  QUIZ_ENDED: { message: 'Quiz ended', code: '400' },
  COURSE_NOT_FOUND: { message: 'Course cycle not found', code: '404' },
  ANSWER_NOT_FOUND: { message: 'Answer not found', code: '404' },
  QUESTION_NOT_FOUND: { message: 'Question not found', code: '404' },
  ANSWERS_NOT_SAME_QUIZ: { message: 'Answers not same quiz', code: '400' },
  ONLY_ESSAY_ANSWER_ALLOWED: {
    message: 'Only essay answer allowed',
    code: '400',
  },
  ALREADY_SUBMIT: { message: 'Student already submit', code: '400' },
};
