import { Field, InputType, ID, Int, PartialType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/utils/file.utils';

@InputType()
export class CreateUserInput {
  @Field()
  full_name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phone: string;

  @Field(() => ID, { nullable: true })
  Faculty_ID?: string;

  @Field(() => ID)
  role_ID: string;

  @Field(() => ID, { nullable: true })
  academic_ID?: string;

  @Field(() => ID, { nullable: true })
  department_ID?: string;

  @Field({ nullable: true })
  level?: number;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  user_ID: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image_path?: Promise<FileUpload>;
}

@InputType()
export class UserFilterInput {
  @Field(() => ID, { nullable: true })
  university_ID?: string;
  @Field(() => ID, { nullable: true })
  faculty_ID?: string;
  @Field(() => ID, { nullable: true })
  department_ID?: string;
  @Field({ nullable: true })
  role?: string;
  @Field(() => Int, { nullable: true })
  level?: number;
  @Field(() => Int, { nullable: true })
  page?: number;
  @Field(() => Int, { nullable: true })
  limit?: number;
}

export interface CurrentUser {
  user_ID: string;
  Faculty_ID: string;
  roles: [string];
}
