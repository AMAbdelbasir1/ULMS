import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('university')
export class UniversityType {
  @Field(() => ID)
  university_ID: string;
  @Field()
  name: string;
  @Field()
  Logo_path: string;
  @Field()
  created_at: Date;
}
