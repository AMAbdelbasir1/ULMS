import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('lecture')
export class LectureType {
  @Field(() => ID)
  lecture_ID: string;
  @Field(() => ID)
  instructor_ID: string;
  @Field()
  full_name: string;
  @Field()
  title: string;
  @Field()
  type: string;
  @Field()
  created_at: Date;
}

/*
  lecture_ID VARCHAR(50) PRIMARY KEY,
  course_cycle_ID varchar(50) NOT NULL FOREIGN KEY REFERENCES Course_semester(cycle_ID),
  title NVARCHAR(255) NOT NULL,
	type NVARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
