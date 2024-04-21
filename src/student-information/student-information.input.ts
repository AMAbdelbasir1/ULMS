import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class StudentInformationInput {
  @Field(() => ID)
  academic_ID: string;

  @Field(() => ID)
  user_ID: string;

  @Field(() => ID)
  department_ID: string;

  @Field(() => Int)
  level: number;
}

@InputType()
export class StudentInformationUpdateInput extends PartialType(
  StudentInformationInput,
) {
  @Field(() => ID)
  user_ID: string;
}
