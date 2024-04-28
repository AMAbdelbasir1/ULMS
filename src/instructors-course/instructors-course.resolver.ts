import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { InstructorsCourseService } from './instructors-course.service';
import { InstructorsCourseValidation } from './instructors-course.validation';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { CurrentUser } from '../user/user.input';
import {
  InstructorsCourseInput,
  DeleteInstructorCourseInput,
} from './instructors-course.input';
import { InstructorCourseType } from './instructors-course.type';

@Resolver()
export class InstructorsCourseResolver {
  constructor(
    private readonly instructorsCourseService: InstructorsCourseService,
    private readonly instructorsCourseValidation: InstructorsCourseValidation,
  ) {}

  @Query(() => [InstructorCourseType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR', 'STUDENT', 'ASSISTANT')
  async getInstructorsCourse(
    @Args('course_cycle_ID') course_cycle_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.instructorsCourseValidation.validateGetInstructorsCourseInput({
      course_cycle_ID,
    });
    return await this.instructorsCourseService.getInstructorsCourseService(
      course_cycle_ID,
      currentUser,
    );
  }
  /**
   *
   * @param studentEnrolmentInput
   * @param currentUser
   * @returns
   */

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createInstructorsCourse(
    @Args('updateInstructorsCourseInput')
    instructorsCourseInput: InstructorsCourseInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.instructorsCourseValidation.validateInstructorsCourseInput(
      instructorsCourseInput,
    );
    return await this.instructorsCourseService.createInstructorsCourseService(
      instructorsCourseInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteInstructorCourse(
    @Args('deleteInstructorCourseInput')
    deleteInstructorCourseInput: DeleteInstructorCourseInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.instructorsCourseValidation.validateDeleteInstructorCourseInput(
      deleteInstructorCourseInput,
    );
    return await this.instructorsCourseService.deleteInstructorCourseService(
      deleteInstructorCourseInput,
      currentUser,
    );
  }
}
