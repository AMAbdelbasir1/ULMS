import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { SemesterService } from './semester.service';
import { SemesterType } from './semester.type';
import {
  SemesterFilterInput,
  SemesterInput,
  UpdateSemesterInput,
} from './semester.input';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { CurrentUser } from '../user/user.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { SemesterValidation } from './semester.validation';

@Resolver(() => SemesterType)
export class SemesterResolver {
  constructor(
    private readonly semesterService: SemesterService,
    private readonly semesterValidation: SemesterValidation,
  ) {}

  /**
   * Retrieves a list of semesters based on the provided filter input.
   * Only authenticated users with the 'ADMIN' role can access this query.
   * The method performs validation on the filter input and calls the getSemestersService method from the SemesterService class.
   * @param semesterFilterInput The filter input to specify the criteria for retrieving semesters.
   * @param currentUser The currently authenticated user.
   * @returns A list of semesters that match the filter criteria.
   */
  @Query(() => [SemesterType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getSemesters(
    @Args('semesterFilterInput') semesterFilterInput: SemesterFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.semesterValidation.validateFilterInput(semesterFilterInput);
    return await this.semesterService.getSemestersService(
      semesterFilterInput,
      currentUser,
    );
  }

  /**
   * Creates a new semester with the provided input data.
   * Only authenticated users with the 'ADMIN' role can access this mutation.
   * The method performs validation on the input data and calls the createSemestersService method from the SemesterService class.
   * @param semesterInput The input data for creating the semester.
   * @param currentUser The currently authenticated user.
   * @returns A message indicating the success or failure of the semester creation.
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createSemester(
    @Args('semesterInput') semesterInput: SemesterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.semesterValidation.validateSemesterInput(semesterInput);
    return await this.semesterService.createSemesterService(
      semesterInput,
      currentUser,
    );
  }

  /**
   * Updates an existing semester with the provided input data.
   * Only authenticated users with the 'ADMIN' role can access this mutation.
   * The method performs validation on the input data and calls the updateSemesterService method from the SemesterService class.
   * @param updateSemesterInput The input data for updating the semester.
   * @param currentUser The currently authenticated user.
   * @returns A message indicating the success or failure of the semester update.
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSemester(
    @Args('updateSemesterInput') updateSemesterInput: UpdateSemesterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.semesterValidation.validateSemesterUpdateInput(updateSemesterInput);
    return await this.semesterService.updateSemesterService(
      updateSemesterInput,
      currentUser,
    );
  }

  /**
   * Deletes a semester with the provided ID.
   * Only authenticated users with the 'ADMIN' role can access this mutation.
   * The method performs validation on the semester ID and calls the deleteSemesterService method from the SemesterService class.
   * @param semester_ID The ID of the semester to be deleted.
   * @param currentUser The currently authenticated user.
   * @returns A message indicating the success or failure of the semester deletion.
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteSemester(
    @Args('semester_ID') semester_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.semesterValidation.validateSemesterUpdateInput({ semester_ID });
    return await this.semesterService.deleteSemesterService(
      semester_ID,
      currentUser,
    );
  }
}
