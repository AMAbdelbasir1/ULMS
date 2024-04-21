import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class QuizInput {
  @Field(() => ID)
  course_cycle_ID: string;

  @Field()
  title: string;

  @Field()
  notes: string;

  @Field()
  grade: number;

  @Field()
  start_Date: string;

  @Field()
  end_Date: string;
}

@InputType()
export class QuizUpdateInput {
  @Field(() => ID)
  quiz_ID: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  grade?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  start_Date?: string;

  @Field({ nullable: true })
  end_Date?: string;
}

@InputType()
export class QuizFilterInput {
  @Field(() => ID, { nullable: true })
  course_cycle_ID?: string;

  @Field({ nullable: true })
  instructor_ID?: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
