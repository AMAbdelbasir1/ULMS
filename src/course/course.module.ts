import { Module } from '@nestjs/common';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { DatabaseModule } from 'src/database/database.module';
import { CourseValidation } from './course.validation';

@Module({
  imports: [DatabaseModule],
  providers: [CourseResolver, CourseService,CourseValidation],
})
export class CourseModule {}
