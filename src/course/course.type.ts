import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('course')
export class CourseType {
  @Field(() => ID)
  course_ID: string;
  @Field()
  name: string;
  @Field()
  hours: number;
  @Field()
  image_path: string;
  @Field(() => ID)
  Faculty_ID?: string;
  @Field()
  created_at: Date;
}
/*
   course_ID VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
	hours INT DEFAULT 0,
	image_path VARCHAR(255),
	Faculty_ID VARCHAR(50) FOREIGN KEY REFERENCES Faculty(faculty_ID),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 */
