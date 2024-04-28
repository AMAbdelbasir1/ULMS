import { Module } from '@nestjs/common';
import { StudentEnrolmentService } from './student-enrolment.service';
import { StudentEnrolmentResolver } from './student-enrolment.resolver';
import { DatabaseModule } from '../database/database.module';
import { StudentEnrolmentValidation } from './student-enrolment.validation';

@Module({
  imports: [DatabaseModule],
  providers: [
    StudentEnrolmentService,
    StudentEnrolmentResolver,
    StudentEnrolmentValidation,
  ],
})
export class StudentEnrolmentModule {}
