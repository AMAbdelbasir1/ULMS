import { Field, ID, InputType } from '@nestjs/graphql';
import { FileUpload } from '../utils/file.utils';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
@InputType()
export class TaskAnswerInput {
  @Field(() => ID)
  task_ID: string;

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}

@InputType()
export class TaskAnswerUpdateInput {
  @Field(() => ID)
  task_answer_ID: string;

  @Field({ nullable: true })
  grade?: number;
}

@InputType()
export class StudentTaskAnswersFilterInput {
  @Field(() => ID)
  course_cycle_ID: string;

  // @Field(() => ID, { nullable: true })
  // task_ID?: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}

@InputType()
export class TaskAnswersFilterInput {
  @Field(() => ID)
  task_ID: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
