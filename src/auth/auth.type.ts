import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('login')
export class LoginType {
  @Field()
  Token: string;
}
