import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CourseSemesterService } from './course-semester.service';
import { CourseSemesterType } from './course-semester.type';
import { CourseSemesterValidation } from './course-semester.validation';
import { CurrentUser } from '../user/user.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import {
  CourseSemesterFilterInput,
  CourseSemesterInput,
  CourseSemesterUpdateInput,
} from './course-semester.input';

@Resolver(() => CourseSemesterType)
export class CourseSemesterResolver {
  constructor(
    private readonly courseSemesterService: CourseSemesterService,
    private readonly courseSemesterValidation: CourseSemesterValidation,
  ) {}

  @Query(() => [CourseSemesterType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR', 'ASSISTANT', 'STUDENT')
  async getSemesterCourses(
    @Args('courseSemesterFilterInput')
    courseSemesterFilterInput: CourseSemesterFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.courseSemesterValidation.validateFilterInput(
      courseSemesterFilterInput,
    );

    if (
      courseSemesterFilterInput.isRunning ||
      currentUser.roles.includes('STUDENT')
    ) {
      return await this.courseSemesterService.getRuningSemesterCoursesService(
        currentUser,
        courseSemesterFilterInput.asInstructor,
      );
    }

    return await this.courseSemesterService.getSemesterCoursesService(
      courseSemesterFilterInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCourseSemester(
    @Args('courseSemesterInput') courseSemesterInput: CourseSemesterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.courseSemesterValidation.validateCourseSemesterInput(
      courseSemesterInput,
    );

    return await this.courseSemesterService.createCourseSemestersService(
      courseSemesterInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCourseSemester(
    @Args('courseSemesterUpdateInput')
    courseSemesterUpdateInput: CourseSemesterUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.courseSemesterValidation.validateCourseSemesterUpdateInput(
      courseSemesterUpdateInput,
    );

    return await this.courseSemesterService.updateCourseSemesterService(
      courseSemesterUpdateInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCourseSemester(
    @Args('cycle_ID') cycle_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.courseSemesterValidation.validateCourseSemesterUpdateInput({
      cycle_ID,
    });

    return await this.courseSemesterService.deleteCourseSemesterService(
      cycle_ID,
      currentUser,
    );
  }
}
