import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('role')
export class RoleType {
  @Field(() => ID)
  role_ID: string;
  @Field()
  name: string;
  @Field()
  created_at: Date;
}
/*
role_ID VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
