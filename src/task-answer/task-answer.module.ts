import { Module } from '@nestjs/common';
import { TaskAnswerResolver } from './task-answer.resolver';
import { TaskAnswerService } from './task-answer.service';
import { TaskAnswerValidation } from './task-answer.validation';
import { DatabaseModule } from '../database/database.module';
import { FtpTestModule } from '../ftp-test/ftp-test.module';

@Module({
  imports: [DatabaseModule, FtpTestModule],
  providers: [TaskAnswerResolver, TaskAnswerService, TaskAnswerValidation],
})
export class TaskAnswerModule {}
