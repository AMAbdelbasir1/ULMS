import { Module } from '@nestjs/common';
import { CourseSemesterResolver } from './course-semester.resolver';
import { CourseSemesterService } from './course-semester.service';
import { DatabaseModule } from 'src/database/database.module';
import { CourseSemesterValidation } from './course-semester.validation';

@Module({
  imports: [DatabaseModule],
  providers: [
    CourseSemesterResolver,
    CourseSemesterService,
    CourseSemesterValidation,
  ],
})
export class CourseSemesterModule {}
