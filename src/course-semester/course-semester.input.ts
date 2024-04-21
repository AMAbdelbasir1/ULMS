import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CourseSemesterInput {
  @Field(() => [ID])
  courses_ID: [string];
}

@InputType()
export class CourseSemesterUpdateInput {
  @Field(() => ID)
  cycle_ID: string;
  @Field(() => ID, { nullable: true })
  course_ID?: string;
}

@InputType()
export class CourseSemesterFilterInput {
  @Field(() => ID)
  semester_ID: string;
  @Field({ nullable: true })
  asInstructor?: boolean;
  @Field({ nullable: true })
  isRunning?: boolean;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
}
