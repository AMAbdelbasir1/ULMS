import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('quiz_answers')
export class QuizAnswersType {
  @Field(() => ID)
  quiz_ID: string;
  @Field()
  quiz_name: string;
  @Field(() => [StudentSubmitType])
  student_answers: StudentSubmitType[];
  @Field()
  created_at: Date;
}

@ObjectType('student_submit')
export class StudentSubmitType {
  @Field(() => ID)
  submit_ID: string;
  @Field(() => ID)
  student_ID: string;
  @Field()
  student_name: string;
  @Field()
  grade: number;
  @Field()
  created_at: Date;
}

@ObjectType('student_quiz_submit')
export class StudentQuizSubmitType {
  @Field(() => ID)
  quiz_ID: string;
  @Field()
  quiz_name: string;
  @Field(() => ID)
  submit_ID: string;
  @Field()
  grade: number;
  @Field()
  created_at: Date;
}

@ObjectType('quiz_answer')
export class QuizAnswerType {
  @Field(() => ID)
  quiz_ID: string;
  @Field()
  quiz_name: string;

  @Field(() => [StudentAnswersType])
  answers: StudentAnswersType[];
}

@ObjectType('student_answers')
export class StudentAnswersType {
  @Field(() => ID)
  answer_ID: string;

  @Field(() => ID)
  question_ID: string;

  @Field()
  question_text: string;

  @Field()
  type: string;

  @Field(() => ID)
  question_answers_ID: string;

  @Field()
  answer_text: string;

  @Field()
  is_correct: boolean;
}

@ObjectType('result_quiz_answer')
export class ResultQuizAnswerType {
  @Field()
  grade: number;

  @Field(() => [ResultAnswerType])
  answers: ResultAnswerType[];
}

@ObjectType('result_answer')
export class ResultAnswerType {
  @Field()
  question_ID: string;

  @Field(() => ID)
  answer_ID: string;

  @Field()
  is_correct: boolean;
}
