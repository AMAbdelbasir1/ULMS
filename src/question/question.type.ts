import { Field, ID, ObjectType } from '@nestjs/graphql';
@ObjectType('question')
export class QuestionType {
  // @Field(() => ID)
  // quiz_ID: string;
  @Field(() => ID)
  question_ID: string;
  @Field()
  text: string;
  @Field()
  type: string;
  @Field()
  grade: number;
  @Field(() => [AnswerType])
  answers: AnswerType[];
  @Field()
  question_created_at: Date;
}

@ObjectType('answer')
export class AnswerType {
  @Field(() => ID)
  answer_ID: string;
  // @Field(() => ID)
  // question_ID: string;
  @Field()
  text: string;
  @Field()
  is_correct: boolean;
  @Field()
  answer_created_at: Date;
}
/*
    question_ID VARCHAR(50) PRIMARY KEY,
    quiz_ID VARCHAR(50) FOREIGN KEY REFERENCES Quiz(quiz_ID),
    text NVARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    grade FLOAT,
	  created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    answer_ID VARCHAR(50) PRIMARY KEY,
    question_ID VARCHAR(50) FOREIGN KEY REFERENCES Questions(question_ID),
    text NVARCHAR(255),
    is_correct BIT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/
