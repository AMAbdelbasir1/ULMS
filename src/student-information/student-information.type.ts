import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('user-information')
export class UserInformationType {
  @Field(() => ID)
  academic_ID: string;

  @Field(() => ID)
  user_ID: string;

  @Field(() => ID)
  department_ID: string;
  @Field()
  level: number;
}
/*
 academic_ID varchar(50) PRIMARY KEY,
    user_ID VARCHAR(50) FOREIGN KEY REFERENCES users(user_ID),
    department_ID VARCHAR(50) FOREIGN KEY REFERENCES Department(department_ID),
    level INT NOT NULL,
    gpa FLOAT
*/
