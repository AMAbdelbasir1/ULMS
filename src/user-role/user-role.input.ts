import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class UserRoleInput {
  @Field(() => ID)
  role_ID: string;

  @Field(() => ID)
  user_ID: string;
}

