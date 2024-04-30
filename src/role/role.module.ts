import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { DatabaseModule } from '../database/database.module';
import { RoleValidation } from './role.validation';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [RoleService, RoleResolver, RoleValidation],
})
export class RoleModule {}
