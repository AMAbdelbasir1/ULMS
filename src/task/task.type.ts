import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('task')
export class TaskType {
  @Field(() => ID)
  task_ID: string;
  @Field(() => ID)
  instructor_ID: string;
  @Field()
  full_name: string;
  @Field(() => ID, { nullable: true })
  course_cycle_ID?: string;
  @Field({ nullable: true })
  name?: string;
  @Field()
  title: string;
  @Field()
  start_Date: Date;
  @Field()
  end_Date: Date;
  @Field()
  grade: number;
  @Field()
  file_path: string;
  @Field()
  created_at: Date;
}

/*
  task_ID VARCHAR(50) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    grade FLOAT ,
    file_path VARCHAR(255) NOT NULL,
    course_cycle_ID varchar(50) FOREIGN KEY REFERENCES Course_semester(cycle_ID),
    instructor_ID VARCHAR(50) FOREIGN KEY REFERENCES Users(user_ID),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
