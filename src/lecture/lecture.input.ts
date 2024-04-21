import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class LectureInput {
  @Field(() => ID)
  course_cycle_ID: string;

  @Field()
  title: string;

  @Field()
  type: string;
}

@InputType()
export class LectureUpdateInput {
  @Field(() => ID)
  lecture_ID: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  type?: string;
}

@InputType()
export class LectureFilterInput {
  @Field(() => ID)
  course_cycle_ID: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  instructor_ID?: string;

  @Field({ nullable: true })
  page?: number;
  
  @Field({ nullable: true })
  limit?: number;
}
