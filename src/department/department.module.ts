import { Module } from '@nestjs/common';
import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';
import { DatabaseModule } from '../database/database.module';
import { DepartmentValidation } from './department.validation';

@Module({
  imports: [DatabaseModule],
  providers: [DepartmentResolver, DepartmentService, DepartmentValidation],
})
export class DepartmentModule {}
