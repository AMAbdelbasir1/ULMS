import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class StudentEnrolmentInput {
  @Field(() => [ID])
  students_ID: [string];
  @Field(() => ID)
  course_cycle_ID: string;
}

@InputType()
export class DeleteStudentEnrolmentInput {
  @Field(() => ID)
  student_ID: string;
  @Field(() => ID)
  course_cycle_ID: string;
}
