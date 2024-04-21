import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StudentEnrolmentService } from './student-enrolment.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CurrentUser } from 'src/user/user.input';
import {
  DeleteStudentEnrolmentInput,
  StudentEnrolmentInput,
} from './student-enrolment.input';
import { StudentEnrolmentValidation } from './student-enrolment.validation';
import { StudentEnrolmentType } from './student-enrolment.type';

@Resolver()
export class StudentEnrolmentResolver {
  constructor(
    private readonly studentEnrolmentService: StudentEnrolmentService,
    private readonly studentEnrolmentValidation: StudentEnrolmentValidation,
  ) {}
  /**
   *
   * @param course_cycle_ID
   * @param currentUser
   * @returns
   */
  @Query(() => [StudentEnrolmentType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR', 'ASSISTANT')
  async getStudentsEnrolment(
    @Args('course_cycle_ID') course_cycle_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.studentEnrolmentValidation.validateGetStudentEnrolmentInput({
      course_cycle_ID,
    });
    return await this.studentEnrolmentService.getStudentsEnrolmentService(
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
  async createStudentEnrolment(
    @Args('updateStudentEnrolmentInput')
    studentEnrolmentInput: StudentEnrolmentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.studentEnrolmentValidation.validateStudentEnrolmentInput(
      studentEnrolmentInput,
    );
    return await this.studentEnrolmentService.createStudentEnrolmentService(
      studentEnrolmentInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteStudentEnrolment(
    @Args('deleteStudentEnrolmentInput')
    deleteStudentEnrolmentInput: DeleteStudentEnrolmentInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.studentEnrolmentValidation.validateDeleteStudentEnrolmentInput(
      deleteStudentEnrolmentInput,
    );
    return await this.studentEnrolmentService.deleteStudentEnrolmentService(
      deleteStudentEnrolmentInput,
      currentUser,
    );
  }
}
