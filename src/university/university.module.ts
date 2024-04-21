import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { DatabaseModule } from 'src/database/database.module';
import { UniversityResolver } from './university.resolver';
import { UniversityValidation } from './university.validation';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [UniversityResolver, UniversityService, UniversityValidation],
  exports: [UniversityService],
})
export class UniversityModule {}
