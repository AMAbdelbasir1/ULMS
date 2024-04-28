import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { TaskValidation } from './task.validation';
import { DatabaseModule } from '../database/database.module';
import { FtpTestModule } from '../ftp-test/ftp-test.module';

@Module({
  imports: [DatabaseModule, FtpTestModule],
  providers: [TaskResolver, TaskService, TaskValidation],
})
export class TaskModule {}
