import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class QuestionInput {
  @Field()
  text: string;

  @Field()
  grade: number;

  @Field()
  type: string;

  @Field(() => [AnswerInput], { nullable: true })
  answers?: AnswerInput[];
}

@InputType()
export class QuestionsInput {
  @Field()
  quiz_ID: string;

  @Field(() => [QuestionInput])
  questions: QuestionInput[];
}

@InputType()
export class QuestionUpdateInput {
  @Field(() => ID)
  question_ID: string;

  @Field({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  grade?: number;
}

@InputType()
export class QuestionFilterInput {
  @Field()
  quiz_ID: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}

@InputType()
export class AnswerInput {
  @Field()
  text: string;

  @Field()
  is_correct: boolean;
}

@InputType()
export class AnswerUpdateInput {
  @Field(() => ID)
  answer_ID: string;

  @Field({ nullable: true })
  text?: string;

  @Field({ nullable: true })
  is_correct?: boolean;
}
