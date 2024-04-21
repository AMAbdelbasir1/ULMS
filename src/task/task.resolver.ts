import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { TaskValidation } from './task.validation';
import { TaskFilterInput, TaskInput, TaskUpdateInput } from './task.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { CurrentUser } from 'src/user/user.input';
import { TaskType } from './task.type';

@Resolver()
export class TaskResolver {
  constructor(
    private readonly taskFileService: TaskService,
    private readonly taskFileValidation: TaskValidation,
  ) {}

  @Query(() => [TaskType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getTasks(
    @Args('filterInput') filterInput: TaskFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<TaskType[]> {
    this.taskFileValidation.validateFilterInput(filterInput);
    return await this.taskFileService.getTasksService(filterInput, currentUser);
  }

  @Query(() => TaskType)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async getTask(
    @Args('task_ID') task_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<TaskType> {
    return await this.taskFileService.getTaskService(task_ID, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async createTask(
    @Args('createTaskInput') createTaskInput: TaskInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskFileValidation.validateTaskInput(createTaskInput);

    return await this.taskFileService.createTaskService(
      createTaskInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: TaskUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskFileValidation.validateTaskUpdateInput(updateTaskInput);
    return await this.taskFileService.updateTaskService(
      updateTaskInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteTask(
    @Args('task_ID') task_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.taskFileValidation.validateTaskUpdateInput({ task_ID });

    return await this.taskFileService.deleteTaskService(task_ID, currentUser);
  }
}
