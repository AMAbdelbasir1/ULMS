import { Field, ID, InputType } from '@nestjs/graphql';
import { FileUpload } from '../utils/file.utils';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
@InputType()
export class LectureFileInput {
  @Field(() => ID)
  lecture_ID: string;

  @Field(() => [GraphQLUpload])
  files: Promise<FileUpload>[];
}

@InputType()
export class LectureFileUpdateInput {
  @Field(() => ID)
  lecture_file_ID: string;

  @Field()
  name: string;
}

@InputType()
export class LectureFileFilterInput {
  @Field(() => ID)
  lecture_ID: string;

  @Field({ nullable: true })
  instructor_ID?: string;
}
