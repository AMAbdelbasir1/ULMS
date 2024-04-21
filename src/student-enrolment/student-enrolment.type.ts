import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('student_enrolment')
export class StudentEnrolmentType {
  @Field(() => ID)
  student_ID: string;
  @Field()
  full_name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  image_path?: string;
  @Field()
  academic_ID: string;
}
