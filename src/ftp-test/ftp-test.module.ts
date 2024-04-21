import { Module } from '@nestjs/common';
import { FtpTestService } from './ftp-test.service';

@Module({
  providers: [FtpTestService],
  exports: [FtpTestService],
})
export class FtpTestModule {}
