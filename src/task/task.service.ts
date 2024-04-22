import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { config } from 'dotenv';
config();

import { DatabaseService } from 'src/database/database.service';
import { handleError } from 'src/utils/graph.error';
import { TaskFilterInput, TaskInput, TaskUpdateInput } from './task.input';
import { errorMessage } from './message.error';
import {
  creatTaskPromisesQuery,
  deleteTaskPromisesQuery,
  getTasksPromisesQuery,
  updateTaskPromisesQuery,
} from './promisesQuery';
import {
  createTaskCheckQuery,
  deleteTaskCheckQuery,
  getTasksCheckQuery,
  updateTaskCheckQuery,
} from './checkQuery';
import {
  deleteOneTaskQuery,
  getCourseTasksQuery,
  getInstructorCoursesTasksQuery,
  getOneTaskQuery,
  getStudentCoursesTasksQuery,
  insertTaskQuery,
  updateTaskQuery,
} from 'src/database/queries/task.query';
import { CurrentUser } from 'src/user/user.input';
import { TaskType } from './task.type';
import { FtpTestService } from 'src/ftp-test/ftp-test.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly conn: DatabaseService,
    private readonly ftpService: FtpTestService,
  ) {}
  /**
   * Service function to get tasks based on the provided filter and the current user.
   *
   * @param {TaskFilterInput} filterInput - The filter to apply when retrieving tasks.
   * @param {CurrentUser} currentUser - The current user.
   * @returns {Promise<TaskType[]>} - A promise that resolves to an array of tasks.
   * @throws {Error} - If an error occurs while retrieving the tasks.
   */
  async getTasksService(
    filterInput: TaskFilterInput,
    currentUser: CurrentUser,
  ): Promise<TaskType[]> {
    try {
      // Retrieve promises for tasks based on the provided filter and current user
      const resultPromises = await getTasksPromisesQuery(
        filterInput.course_cycle_ID,
        currentUser,
        this.conn,
      );

      // Check the retrieved tasks for errors
      getTasksCheckQuery(
        resultPromises,
        currentUser,
        filterInput.course_cycle_ID,
      );

      const page = filterInput.page || 1;
      const limit = filterInput.limit || 10;
      // If a course cycle ID is provided, retrieve tasks for the course cycle
      if (filterInput.course_cycle_ID) {
        const tasks = await this.conn.query(
          getCourseTasksQuery({ ...filterInput, page, limit }),
        );
        console.log(tasks.recordset[0]);
        return this.transfromTask(tasks.recordset);
      }
      // If the current user is not a student, retrieve tasks for the instructor
      else if (!currentUser.roles.includes('STUDENT')) {
        const tasks = await this.conn.query(
          getInstructorCoursesTasksQuery({
            user_ID: currentUser.user_ID,
            ...filterInput,
            page,
            limit,
          }),
        );
        return this.transfromTask(tasks.recordset);
      }
      // Retrieve tasks for the student
      else {
        const tasks = await this.conn.query(
          getStudentCoursesTasksQuery({
            user_ID: currentUser.user_ID,
            ...filterInput,
            page,
            limit,
          }),
        );
        return this.transfromTask(tasks.recordset);
      }
    } catch (error) {
      // If an error occurs, handle it
      handleError(error, errorMessage);
    }
  }
  private transfromTask(tasks: TaskType[]): TaskType[] {
    return tasks.map((task) => {
      return {
        ...task,
        file_path: process.env.BASE_URL + '/files/file/task/' + task.task_ID,
      };
    });
  }
  /**
   *
   * @param task_ID
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTaskService(task_ID: string, currentUser: CurrentUser) {
    try {
      const tasks = await this.conn.query(getOneTaskQuery(task_ID));
      return tasks.recordset[0];
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param taskInput
   * @param currentUser
   * @returns
   */
  async createTaskService(taskInput: TaskInput, currentUser: CurrentUser) {
    let file_path: string;
    try {
      const { file, ...inputs } = taskInput;
      const resultPromises = await creatTaskPromisesQuery(
        taskInput.course_cycle_ID,
        currentUser.user_ID,
        this.conn,
      );

      createTaskCheckQuery(resultPromises, {
        start_Date: new Date(taskInput.start_Date),
        end_Date: new Date(taskInput.end_Date),
      });

      const { filePath } = await this.ftpService.saveFileToFtp(file, 'tasks');
      file_path = filePath;
      await this.conn.query(
        insertTaskQuery({
          task_ID: uuid(),
          ...inputs,
          file_path: filePath,
          instructor_ID: currentUser.user_ID,
        }),
      );
      return 'Task created successfully';
    } catch (error) {
      if (file_path) {
        this.ftpService.deleteFileFromFtp(file_path);
      }
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param taskUpdateInput
   * @param currentUser
   * @returns
   */
  async updateTaskService(
    taskUpdateInput: TaskUpdateInput,
    currentUser: CurrentUser,
  ) {
    let file_Path: string;
    try {
      const { file, ...updateInput } = taskUpdateInput;

      if (Object.keys(updateInput).length === 0) {
        throw 'ENTER_DATA';
      }

      const resultPromises = await updateTaskPromisesQuery(
        taskUpdateInput.task_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateTaskCheckQuery(resultPromises, currentUser, {
        start_Date: new Date(taskUpdateInput.start_Date),
        end_Date: new Date(taskUpdateInput.end_Date),
      });

      if (file) {
        const { filePath } = await this.ftpService.saveFileToFtp(file, 'tasks');
        await this.ftpService.deleteFileFromFtp(
          resultPromises[0].recordset[0].file_path,
        );
        file_Path = filePath;
      }
      await this.conn.query(
        updateTaskQuery({
          ...updateInput,
          file_path: file_Path,
        }),
      );
      return 'Task updated successfully';
    } catch (error) {
      if (file_Path) {
        this.ftpService.deleteFileFromFtp(file_Path);
      }
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param task_ID
   * @param currentUser
   * @returns
   */
  async deleteTaskService(task_ID: string, currentUser: CurrentUser) {
    try {
      const resultPromises = await deleteTaskPromisesQuery(
        task_ID,
        currentUser.user_ID,
        this.conn,
      );
      deleteTaskCheckQuery(resultPromises, currentUser);

      await this.conn.query(deleteOneTaskQuery(task_ID));

      this.ftpService.deleteFileFromFtp(
        resultPromises[0].recordset[0].file_path,
      );

      return 'Task deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
