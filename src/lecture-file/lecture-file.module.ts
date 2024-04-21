import { Module } from '@nestjs/common';
import { LectureFileResolver } from './lecture-file.resolver';
import { LectureFileService } from './lecture-file.service';
import { DatabaseModule } from 'src/database/database.module';
import { LectureFileValidation } from './lecture-file.validation';

@Module({
  imports: [DatabaseModule],
  providers: [LectureFileResolver, LectureFileService, LectureFileValidation],
})
export class LectureFileModule {}
