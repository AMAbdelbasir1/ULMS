import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('lecture_file')
export class LectureFileType {
  @Field(() => ID)
  lecture_file_ID: string;
  @Field(() => ID)
  instructor_ID: string;
  @Field()
  full_name: string;
  @Field()
  name: string;
  @Field()
  file_path: string;
  @Field()
  extension: string;
  @Field()
  type: string;
  @Field()
  created_at: Date;
}

/*
  Lecture_file_ID VARCHAR(50) PRIMARY KEY,
  lecture_ID varchar(50) NOT NULL FOREIGN KEY REFERENCES Lecture(lecture_ID),
	instructor_ID VARCHAR(50) FOREIGN KEY REFERENCES Users(user_ID),
  file_path VARCHAR(255) NOT NULL,
	name NVARCHAR(200) ,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
