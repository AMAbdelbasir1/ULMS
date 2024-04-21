import { Field, ID, InputType } from '@nestjs/graphql';
@InputType()
export class RoleInput {
  @Field()
  name: string;
}

@InputType()
export class RoleUpdateInput {
  @Field(() => ID)
  role_ID: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class RoleFilterInput {
  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
