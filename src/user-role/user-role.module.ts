import { Module } from '@nestjs/common';
import { UserRoleResolver } from './user-role.resolver';
import { UserRoleService } from './user-role.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  providers: [UserRoleResolver, UserRoleService]
})
export class UserRoleModule {}
