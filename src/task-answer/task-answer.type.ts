import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('task_anwser')
export class TaskAnswerType {
  @Field(() => ID)
  answer_ID: string;
  @Field(() => ID)
  task_ID: string;
  @Field()
  task_name: string;
  @Field(() => ID, { nullable: true })
  course_cycle_ID: string;
  @Field({ nullable: true })
  course_name: string;
  @Field(() => ID, { nullable: true })
  student_ID: string;
  @Field({ nullable: true })
  student_name: string;
  @Field()
  grade: number;
  @Field()
  file_path: string;
  @Field()
  created_at: Date;
}

/*
  answer_ID VARCHAR(50) PRIMARY KEY,
  task_ID VARCHAR(50) FOREIGN KEY REFERENCES Task(task_ID),
  student_ID VARCHAR(50) FOREIGN KEY REFERENCES Users(user_ID),
  file_path VARCHAR(255) NOT NULL,
	grade FLOAT ,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
