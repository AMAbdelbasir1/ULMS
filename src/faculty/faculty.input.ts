import { Field, ID, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/utils/file.utils';

@InputType()
export class FacultyInput {
  @Field(() => ID)
  university_ID: string;
  @Field()
  name: string;
  @Field()
  levels: number;
  @Field(() => GraphQLUpload)
  logo: FileUpload;
}

@InputType()
export class FacultyUpdateInput {
  @Field(() => ID)
  faculty_ID: string;

  @Field(() => ID, { nullable: true })
  university_ID?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  levels?: number;

  @Field(() => ID, { nullable: true })
  last_semester_ID?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  logo?: FileUpload;
}

@InputType()
export class FacultyFilterInput {
  @Field(() => ID, { nullable: true })
  university_ID?: string;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
}
