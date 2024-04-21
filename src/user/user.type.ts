import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('user')
export class UserType {
  @Field(() => ID)
  user_ID: string;
  @Field()
  full_name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  image_path?: string;
  @Field()
  status: string;
  @Field(() => [String])
  roles: string[];
}

// @Field({ nullable: true })
// phone: string;
// @Field({ nullable: true })
// Faculty_ID: string;
// @Field()
// created_at: Date;
