import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('instructor_course')
export class InstructorCourseType {
  @Field(() => ID)
  instructor_ID: string;
  @Field()
  full_name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  image_path?: string;
  @Field()
  role: string;
}
