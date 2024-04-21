import { Field, ID, InputType } from '@nestjs/graphql';
import { FileUpload } from 'src/utils/file.utils';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
@InputType()
export class TaskInput {
  @Field(() => ID)
  course_cycle_ID: string;

  @Field()
  title: string;

  @Field()
  grade: number;

  @Field()
  start_Date: string;

  @Field()
  end_Date: string;

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}

@InputType()
export class TaskUpdateInput {
  @Field(() => ID)
  task_ID: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  grade?: number;

  @Field({ nullable: true })
  start_Date?: string;

  @Field({ nullable: true })
  end_Date?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  file?: Promise<FileUpload>;
}

@InputType()
export class TaskFilterInput {
  @Field(() => ID, { nullable: true })
  course_cycle_ID?: string;

  @Field({ nullable: true })
  instructor_ID?: string;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  limit?: number;
}
