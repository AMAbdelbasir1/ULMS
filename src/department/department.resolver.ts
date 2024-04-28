import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DepartmentService } from './department.service';
import { DepartmentType } from './department.type';
import {
  DepartmentFilterInput,
  DepartmentInput,
  DepartmentUpdateInput,
} from './department.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { CurrentUser } from '../user/user.input';
import { DepartmentValidation } from './department.validation';

@Resolver()
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly departmentValidation: DepartmentValidation,
  ) {}
  @Query(() => [DepartmentType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllDepartment(
    @Args('DepartmentFilter') departmentFilterInput: DepartmentFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.departmentValidation.validateFilterInput(departmentFilterInput);
    return this.departmentService.getAllDepartmentService(
      departmentFilterInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createDepartment(
    @Args('departmetInput') departmetInput: DepartmentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.departmentValidation.validateDepartmentInput(departmetInput);
    return this.departmentService.createDepartmentService(
      departmetInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateDepartment(
    @Args('updateDepartmentInput') updateDepartmentInput: DepartmentUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.departmentValidation.validateDepartmentUpdateInput(
      updateDepartmentInput,
    );
    return this.departmentService.updateDepartmentService(
      updateDepartmentInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteDepartment(
    @Args('department_ID') department_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.departmentValidation.validateDepartmentUpdateInput({ department_ID });
    return this.departmentService.deleteDepartmentService(
      department_ID,
      currentUser,
    );
  }
}
