import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class QuizAnswerInput {
  @Field(() => ID)
  quiz_ID: string;

  @Field(() => [SubmitAnswerInput])
  answers: SubmitAnswerInput[];
}

@InputType()
export class SubmitAnswerInput {
  @Field(() => ID)
  question_ID: string;

  @Field(() => ID, { nullable: true })
  answer_ID?: string;

  @Field({ nullable: true })
  text?: string;
}

@InputType()
export class QuizAnswerUpdateInput {
  @Field(() => ID)
  answer_ID: string;

  @Field()
  grade: number;
}

@InputType()
export class QuizAnswerFilterInput {
  @Field(() => ID)
  quiz_ID: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
