import { Field, ID, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/utils/file.utils';

@InputType()
export class universityUpdateInput {
  @Field(() => ID)
  university_ID: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  logo?: Promise<FileUpload>;
}
