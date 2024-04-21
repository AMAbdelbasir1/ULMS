import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserRoleService } from './user-role.service';
import { UserRoleInput } from './user-role.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { CurrentUser } from 'src/user/user.input';
import { UserRoleType } from './user-role.type';

@Resolver()
export class UserRoleResolver {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Query(() => [UserRoleType])
  @UseGuards(AuthGuard)
  async getAllUserRoles(
    @GetCurrentUser() currentUser: CurrentUser,
    @Args('user_ID', { nullable: true }) user_ID?: string,
  ) {
    return this.userRoleService.getAllUserRolesService(currentUser, user_ID);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async createUserRole(
    @Args('roleInput') userRoleInput: UserRoleInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    return this.userRoleService.createUserRoleService(
      userRoleInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async deleteUserRole(
    @Args('roleInput') userRoleInput: UserRoleInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    return this.userRoleService.deleteUserRoleService(
      userRoleInput,
      currentUser,
    );
  }
}
