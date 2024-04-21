import { Module } from '@nestjs/common';
import { InstructorsCourseService } from './instructors-course.service';
import { InstructorsCourseResolver } from './instructors-course.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { InstructorsCourseValidation } from './instructors-course.validation';

@Module({
  imports: [DatabaseModule],
  providers: [
    InstructorsCourseService,
    InstructorsCourseResolver,
    InstructorsCourseValidation,
  ],
})
export class InstructorsCourseModule {}
