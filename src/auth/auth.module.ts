import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from 'src/database/database.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AuthValidation } from './auth.validation';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' }, // Token expiration time
    }),
    DatabaseModule,
  ],
  providers: [AuthResolver, AuthService, AuthValidation, AuthGuard, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
