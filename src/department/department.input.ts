import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DepartmentInput {
  @Field()
  name: string;
}

@InputType()
export class DepartmentUpdateInput {
  @Field(() => ID)
  department_ID: string;
  
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class DepartmentFilterInput {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
}
