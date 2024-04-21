import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('course_semester')
export class CourseSemesterType {
  @Field(() => ID)
  cycle_ID: string;
  @Field(() => ID)
  course_ID: string;
  @Field()
  name: string;
  @Field()
  hours: number;
  @Field()
  image_path: string;
  @Field()
  created_at: Date;
}

/**
 *  cycle_ID varchar(50) PRIMARY KEY,
    Semester_ID VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Semester(Semester_ID),
    Course_ID VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Course(course_ID),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
 */
