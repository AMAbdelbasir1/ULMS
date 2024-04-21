import { Module } from '@nestjs/common';
import { FacultyResolver } from './faculty.resolver';
import { FacultyService } from './faculty.service';
import { DatabaseModule } from 'src/database/database.module';
import { FacultyValidation } from './faculty.validation';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [FacultyResolver, FacultyService, FacultyValidation],
  exports: [FacultyService],
})
export class FacultyModule {}
