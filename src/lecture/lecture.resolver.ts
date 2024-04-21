import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { LectureService } from './lecture.service';
import { LectureValidation } from './lecture.validation';
import { LectureType } from './lecture.type';
import {
  LectureFilterInput,
  LectureInput,
  LectureUpdateInput,
} from './lecture.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { CurrentUser } from 'src/user/user.input';

@Resolver()
export class LectureResolver {
  constructor(
    private readonly lectureService: LectureService,
    private readonly lectureValidation: LectureValidation,
  ) {}

  @Query(() => [LectureType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getLecturesCourse(
    @Args('lectureFilter') filterInput: LectureFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LectureType[]> {
    this.lectureValidation.validateFilterInput(filterInput);

    return this.lectureService.getLecturesService(filterInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async createLecture(
    @Args('lectureInput') lectureInput: LectureInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureValidation.validateLectureInput(lectureInput);

    return this.lectureService.createLectureService(lectureInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateLecture(
    @Args('lectureUpdateInput') lectureUpdateInput: LectureUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureValidation.validateLectureUpdateInput(lectureUpdateInput);

    return this.lectureService.updateLectureService(
      lectureUpdateInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteLecture(
    @Args('lecture_ID') lecture_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureValidation.validateLectureUpdateInput({  lecture_ID });

    return this.lectureService.deleteLectureService(lecture_ID, currentUser);
  }
}
