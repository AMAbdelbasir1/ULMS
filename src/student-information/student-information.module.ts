import { Module } from '@nestjs/common';
import { StudentInformationService } from './student-information.service';
import { StudentInformationResolver } from './student-information.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { StudentInformationValidation } from './student-information.validation';

@Module({
  imports: [DatabaseModule],
  providers: [
    StudentInformationService,
    StudentInformationResolver,
    StudentInformationValidation,
  ],
})
export class StudentInformationModule {}
