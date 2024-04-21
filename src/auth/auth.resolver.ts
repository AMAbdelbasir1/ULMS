import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './auth.input';
import { LoginType } from './auth.type';
import { AuthValidation } from './auth.validation';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authValidation: AuthValidation,
  ) {}
  @Mutation(() => LoginType)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginType> {
    this.authValidation.validateLoginInput(loginInput);
    return this.authService.loginService(loginInput);
  }
}
/**
 *  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
 */
