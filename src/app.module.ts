import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UniversityModule } from './university/university.module';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { RoleModule } from './role/role.module';
import { CourseModule } from './course/course.module';
import { UserRoleModule } from './user-role/user-role.module';
import { SemesterModule } from './semester/semester.module';
import { CourseSemesterModule } from './course-semester/course-semester.module';
import { StudentEnrolmentModule } from './student-enrolment/student-enrolment.module';
import { InstructorsCourseModule } from './instructors-course/instructors-course.module';
import { LectureModule } from './lecture/lecture.module';
import { LectureFileModule } from './lecture-file/lecture-file.module';
import { FilesModule } from './files/files.module';
import { FtpTestModule } from './ftp-test/ftp-test.module';
import { TaskModule } from './task/task.module';
import { TaskAnswerModule } from './task-answer/task-answer.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { QuizAnswersModule } from './quiz-answers/quiz-answers.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      playground: true, // Enable GraphQL playground in production
      formatError: (err) => {
        return {
          message: err.message,
          code: err.extensions.code,
          status: err.extensions.status,
          messages: err.extensions.messages || null,
        };
      },
      installSubscriptionHandlers: true,
      resolvers: { Upload: GraphQLUpload },
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: '.env',
    // }),
    AuthModule,
    DatabaseModule,
    UserModule,
    UniversityModule,
    FacultyModule,
    DepartmentModule,
    RoleModule,
    CourseModule,
    UserRoleModule,
    SemesterModule,
    CourseSemesterModule,
    StudentEnrolmentModule,
    InstructorsCourseModule,
    LectureModule,
    LectureFileModule,
    FilesModule,
    FtpTestModule,
    TaskModule,
    TaskAnswerModule,
    QuizModule,
    QuestionModule,
    QuizAnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
