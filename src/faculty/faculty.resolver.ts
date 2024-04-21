import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FacultyService } from './faculty.service';
import { FacultyType } from './faculty.type';
import {
  FacultyFilterInput,
  FacultyInput,
  FacultyUpdateInput,
} from './faculty.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { FacultyValidation } from './faculty.validation';

@Resolver(() => FacultyType)
export class FacultyResolver {
  constructor(
    private facultyService: FacultyService,
    private readonly facultyValidation: FacultyValidation,
  ) {}

  @Query(() => [FacultyType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getFaculties(
    @Args('facultyFilter') facultyFilterInput: FacultyFilterInput,
  ): Promise<FacultyType> {
    this.facultyValidation.validateFilterInput(facultyFilterInput);

    return await this.facultyService.getFaculitiesService(facultyFilterInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createFaculty(
    @Args('facultyInput') facultyInput: FacultyInput,
  ): Promise<string> {
    this.facultyValidation.validateFacultyInput(facultyInput);

    return await this.facultyService.createFacultyService(facultyInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async updateFaculty(
    @Args('facultyUpdateInput') facultyUpdateInput: FacultyUpdateInput,
  ): Promise<string> {
    this.facultyValidation.validateFacultyUpdateInput({
      facultyUpdateInput,
    });

    return await this.facultyService.updateFacultyService(facultyUpdateInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async deleteFaculty(@Args('faculty_ID') faculty_ID: string): Promise<string> {
    this.facultyValidation.validateFacultyUpdateInput({ faculty_ID });

    return await this.facultyService.deleteFacultyService(faculty_ID);
  }
}
