import { Module } from '@nestjs/common';
import { LectureResolver } from './lecture.resolver';
import { LectureService } from './lecture.service';
import { DatabaseModule } from '../database/database.module';
import { LectureValidation } from './lecture.validation';

@Module({
  imports: [DatabaseModule],
  providers: [LectureResolver, LectureService, LectureValidation],
})
export class LectureModule {}
