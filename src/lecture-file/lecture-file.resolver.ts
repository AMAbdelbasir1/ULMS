import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LectureFileService } from './lecture-file.service';
import { LectureFileValidation } from './lecture-file.validation';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { CurrentUser } from '../user/user.input';
import {
  LectureFileFilterInput,
  LectureFileInput,
  LectureFileUpdateInput,
} from './lecture-file.input';
import { LectureFileType } from './lecture-file.type';

@Resolver()
export class LectureFileResolver {
  constructor(
    private readonly lectureFileService: LectureFileService,
    private readonly lectureFileValidation: LectureFileValidation,
  ) {}

  @Query(() => [LectureFileType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getLectureFilesCourse(
    @Args('lectureFileFilter') filterInput: LectureFileFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<LectureFileType[]> {
    this.lectureFileValidation.validateFilterInput(filterInput);

    return this.lectureFileService.getLectureFilesService(
      filterInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async uploadLectureFiles(
    @Args('lectureFileInput') lectureInput: LectureFileInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureFileValidation.validateLectureFileInput(lectureInput);

    return this.lectureFileService.uploadLectureFilesService(
      lectureInput,
      currentUser,
    );
  }
  /**
   * A function to update the lecture file.
   *
   * @param {LectureFileUpdateInput} lectureFileUpdateInput - the input for updating lecture file
   * @param {CurrentUser} currentUser - the current user
   * @return {Promise<string>} the updated lecture file
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateLectureFile(
    @Args('lectureFileUpdateInput')
    lectureFileUpdateInput: LectureFileUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureFileValidation.validateLectureFileUpdateInput(
      lectureFileUpdateInput,
    );

    return this.lectureFileService.updateLectureFileService(
      lectureFileUpdateInput,
      currentUser,
    );
  }
  /**
   * delete a lecture file
   *
   * @param {string} lecture_file_ID - ID of the lecture file to be deleted
   * @param {CurrentUser} currentUser - current user object
   * @return {Promise<string>} ID of the deleted lecture file
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteLectureFile(
    @Args('lecture_file_ID') lecture_file_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.lectureFileValidation.validateLectureFileDeleteInput({
      lecture_file_ID,
    });

    return this.lectureFileService.deleteLectureFileService(
      lecture_file_ID,
      currentUser,
    );
  }
}
