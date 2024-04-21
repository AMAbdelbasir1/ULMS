import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('faculty')
export class FacultyType {
  @Field(() => ID)
  faculty_ID: string;
  @Field()
  name: string;
  @Field()
  Logo_path: string;
  @Field(() => ID)
  university_ID: string;
  @Field()
  university_name: string;
  @Field()
  created_at: Date;
}

// @Field()
// levels: number;
// @Field(() => ID, { nullable: true })
// last_semester_ID?: string;
