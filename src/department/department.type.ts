import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('department')
export class DepartmentType {
  @Field(() => ID)
  department_ID: string;
  @Field()
  name: string;
  @Field()
  created_at: Date;
}
/*
    department_ID VARCHAR(50) PRIMARY KEY,
    faculty_ID VARCHAR(50) FOREIGN KEY REFERENCES Faculty(faculty_ID),
    name VARCHAR(255) NOT NULL,
	  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
