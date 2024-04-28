import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from './user.service';
import {
  CurrentUser,
  UpdateUserInput,
  UserFilterInput,
  CreateUserInput,
} from './user.input';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserValidation } from './user.validation';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private userService: UserService,
    private readonly userValidation: UserValidation,
  ) {}

  /**
   *
   * @param filterInput
   * @param currentUser
   * @returns
   */
  @Query(() => [UserType], { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getUsers(
    @Args('userFilterInput') filterInput: UserFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.userValidation.validateUserFilterInput(filterInput);

    return await this.userService.getUsersService(filterInput, currentUser);
  }

  /**
   *
   * @param user
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async createUser(
    @Args('user') user: CreateUserInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.userValidation.validateCreateUserInput(user);

    return await this.userService.createUserService(user, currentUser);
  }
  /**
   *
   * @param updateUserInput
   * @param currentUser
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.userValidation.validateUpdateUserInput(updateUserInput);

    return await this.userService.updateUserService(
      updateUserInput,
      currentUser,
    );
  }

  /**
   *
   * @param user_ID
   * @param currentUser
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async deleteUser(
    @Args('user_ID') user_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.userValidation.validateUpdateUserInput({ user_ID });

    return await this.userService.deleteUserService(user_ID, currentUser);
  }
}
