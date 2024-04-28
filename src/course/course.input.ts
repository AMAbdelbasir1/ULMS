import { Field, ID, InputType } from '@nestjs/graphql';
import { FileUpload } from '../utils/file.utils';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class CourseInput {
  @Field()
  name: string;
  @Field()
  hours: number;
  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>;
}

@InputType()
export class CourseUpdateInput {
  @Field(() => ID)
  course_ID: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  hours?: number;
  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;
}

@InputType()
export class CourseFilterInput {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
}
