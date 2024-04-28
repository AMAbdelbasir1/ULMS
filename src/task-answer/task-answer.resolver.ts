import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TaskAnswerService } from './task-answer.service';
import { TaskAnswerValidation } from './task-answer.validation';
import {
  StudentTaskAnswersFilterInput,
  TaskAnswerInput,
  TaskAnswerUpdateInput,
  TaskAnswersFilterInput,
} from './task-answer.input';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { CurrentUser } from '../user/user.input';
import { TaskAnswerType } from './task-answer.type';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@Resolver()
export class TaskAnswerResolver {
  constructor(
    private readonly taskAnswerService: TaskAnswerService,
    private readonly taskAnswerValidation: TaskAnswerValidation,
  ) {}

  /**
   *
   * @param taskAnswerFilterInput
   * @param currentUser
   * @returns
   */
  @Query(() => [TaskAnswerType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STUDENT')
  async getStudentTaskAnswers(
    @Args('taskAnswerFilter')
    taskAnswerFilterInput: StudentTaskAnswersFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<TaskAnswerType[]> {
    this.taskAnswerValidation.validateStudentFilterInput(taskAnswerFilterInput);

    return this.taskAnswerService.getStudentTaskAnswersService(
      taskAnswerFilterInput,
      currentUser,
    );
  }

  /**
   *
   * @param taskAnswerFilterInput
   * @param currentUser
   * @returns
   */
  @Query(() => [TaskAnswerType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async getTaskAnswers(
    @Args('taskAnswerFilter')
    taskAnswerFilterInput: TaskAnswersFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<TaskAnswerType[]> {
    this.taskAnswerValidation.validateFilterInput(taskAnswerFilterInput);

    return this.taskAnswerService.getTaskAnswersService(
      taskAnswerFilterInput,
      currentUser,
    );
  }
  /**
   *
   * @param taskAnswerInput
   * @param currentUser
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STUDENT')
  async uploadTaskAnswer(
    @Args('taskAnswerInput') taskAnswerInput: TaskAnswerInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskAnswerValidation.validateTaskAnswerInput(taskAnswerInput);
    return await this.taskAnswerService.uploadTaskAnswerService(
      taskAnswerInput,
      currentUser,
    );
  }
  /**
   *
   * @param taskAnswerUpdateInput
   * @param currentUser
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateTaskAnswer(
    @Args('taskAnswerUpdateInput') taskAnswerUpdateInput: TaskAnswerUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskAnswerValidation.validateTaskAnswerInput(taskAnswerUpdateInput);
    return await this.taskAnswerService.updateTaskAnswerService(
      taskAnswerUpdateInput,
      currentUser,
    );
  }
  /**
   *
   * @param task_ID
   * @param currentUser
   * @returns
   */
  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async deleteTaskAnswer(
    @Args('task_ID') task_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskAnswerValidation.validateTaskAnswerUpdateInput({ task_ID });
    return await this.taskAnswerService.deleteTaskAnswerService(
      task_ID,
      currentUser,
    );
  }
}
