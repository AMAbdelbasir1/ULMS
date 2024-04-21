import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('userRole')
export class UserRoleType {
  @Field(() => ID)
  role_ID: string;

  @Field()
  name: string;
}
