import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class InstructorsCourseInput {
  @Field(() => [ID])
  instructors_ID: [string];
  @Field(() => ID)
  course_cycle_ID: string;
}

@InputType()
export class DeleteInstructorCourseInput {
  @Field(() => ID)
  instructor_ID: string;
  @Field(() => ID)
  course_cycle_ID: string;
}
