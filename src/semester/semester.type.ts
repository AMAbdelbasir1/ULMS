import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('semester')
export class SemesterType {
  @Field(() => ID)
  semester_ID: string;
  @Field()
  start_Date: Date;
  @Field()
  end_Date: Date;
  @Field()
  years: string;
  @Field(() => Int)
  number: number;
}
/**
 *  Semester_ID VARCHAR(50) PRIMARY KEY,
    faculty_ID VARCHAR(50) FOREIGN KEY REFERENCES Faculty(faculty_ID),
    start_Date DATE NOT NULL,
    end_Date DATE NOT NULL,
    years varchar(50) NOT NULL,
    number INT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 */
