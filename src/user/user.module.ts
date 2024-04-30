import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { DatabaseModule } from '../database/database.module';
import { UserValidation } from './user.validation';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService, UserValidation],
})
export class UserModule {}
