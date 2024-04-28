/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CourseService } from './course.service';
import { CourseType } from './course.type';
import {
  CourseFilterInput,
  CourseInput,
  CourseUpdateInput,
} from './course.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { CurrentUser } from '../user/user.input';
import { CourseValidation } from './course.validation';

@Resolver(() => CourseType)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseValidation: CourseValidation,
  ) {}

  @Query(() => [CourseType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getCourses(
    @Args('courseFilter') courseFilterInput: CourseFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<CourseType> {
    this.courseValidation.validateFilterInput(courseFilterInput);
    return await this.courseService.getCoursesService(
      courseFilterInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCourse(
    @Args('courseInput') courseInput: CourseInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.courseValidation.validateCourseInput(courseInput);
    return await this.courseService.createCourseService(
      courseInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async courseUpdate(
    @Args('courseUpdateInput') courseUpdateInput: CourseUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    const { image, ...updateInput } = courseUpdateInput;
    this.courseValidation.validateCourseUpdateInput(updateInput);
    return await this.courseService.updateCourseService(
      courseUpdateInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCourse(
    @Args('course_ID') course_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.courseValidation.validateCourseUpdateInput({ course_ID });
    return await this.courseService.deleteCourseService(course_ID, currentUser);
  }
}
