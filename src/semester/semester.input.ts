import { Field, ID, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class SemesterInput {
  @Field()
  start_date: Date;
  @Field()
  end_date: Date;
  @Field()
  years: string;
  @Field(() => Int)
  number: number;
}

@InputType()
export class UpdateSemesterInput extends PartialType(SemesterInput) {
  @Field(() => ID)
  semester_ID: string;
}

@InputType()
export class SemesterFilterInput {
  @Field({ nullable: true })
  years?: string;
  @Field(() => Int, { nullable: true })
  number?: number;
  @Field(() => Int, { nullable: true })
  page?: number;
  @Field(() => Int, { nullable: true })
  limit?: number;
}
