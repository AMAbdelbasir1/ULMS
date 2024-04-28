import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterResolver } from './semester.resolver';
import { DatabaseModule } from '../database/database.module';
import { SemesterValidation } from './semester.validation';

@Module({
  imports: [DatabaseModule],
  providers: [SemesterService, SemesterResolver, SemesterValidation],
})
export class SemesterModule {}
