import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DatabaseModule } from 'src/database/database.module';
import { FilesFtpService } from './filesFtp.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController],
  providers: [FilesService, FilesFtpService],
})
export class FilesModule {}
