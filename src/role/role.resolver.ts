import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { RoleType } from './role.type';
import { RoleFilterInput, RoleInput, RoleUpdateInput } from './role.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { RoleValidation } from './role.validation';

@Resolver()
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleValidation: RoleValidation,
  ) {}
  @Query(() => [RoleType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async getAllRoles(@Args('roleFilter') filterInput: RoleFilterInput) {
    this.roleValidation.validateFilterInput(filterInput);

    return this.roleService.getAllRolesService(filterInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createRole(@Args('roleInput') roleInput: RoleInput): Promise<string> {
    this.roleValidation.validateRoleInput(roleInput);

    return this.roleService.createRoleService(roleInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async updateRole(
    @Args('roleUpdateInput') roleUpdateInput: RoleUpdateInput,
  ): Promise<string> {
    this.roleValidation.validateRoleUpdateInput(roleUpdateInput);

    return this.roleService.updateRoleService(roleUpdateInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async deleteRole(@Args('role_ID') role_ID: string): Promise<string> {
    this.roleValidation.validateRoleUpdateInput({ role_ID });

    return this.roleService.deleteRoleService(role_ID);
  }
}
