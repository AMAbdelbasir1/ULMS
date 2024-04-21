import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import { FtpTestService } from 'src/ftp-test/ftp-test.service';
import { handleError } from 'src/utils';
import { errorMessage } from './message.error';
import {
  StudentTaskAnswersFilterInput,
  TaskAnswerInput,
  TaskAnswerUpdateInput,
  TaskAnswersFilterInput,
} from './task-answer.input';
import { CurrentUser } from 'src/user/user.input';
import {
  deleteTaskAnswerPromisesQuery,
  getStudentTaskAnswersPromisesQuery,
  getTaskAnswersPromisesQuery,
  updateTaskAnswerPromisesQuery,
  uploadTaskAnswerPromisesQuery,
} from './promisesQuery';
import {
  deleteTaskAnswerCheckQuery,
  getStudentTaskAnswersCheckQuery,
  getTaskAnswersCheckQuery,
  updateTaskAnswerCheckQuery,
  uploadTaskAnswerCheckQuery,
} from './checkQuery';
import {
  deleteOneTaskAnswerQuery,
  getStudentTaskAnswersQuery,
  getTaskAnswersQuery,
  updateTaskAnswerQuery,
  uploadTaskAnswerQuery,
} from 'src/database/queries/task-answer.query';
import { TaskAnswerType } from './task-answer.type';

@Injectable()
export class TaskAnswerService {
  constructor(
    private readonly conn: DatabaseService,
    private readonly ftpService: FtpTestService,
  ) {}
  /**
   *
   * @param taskAnswerFilterInput
   * @param currentUser
   * @returns
   */
  async getStudentTaskAnswersService(
    taskAnswerFilterInput: StudentTaskAnswersFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getStudentTaskAnswersPromisesQuery(
        taskAnswerFilterInput.course_cycle_ID,
        currentUser.user_ID,
        this.conn,
      );

      getStudentTaskAnswersCheckQuery(resultPromises);

      const page = taskAnswerFilterInput.page || 1;
      const limit = taskAnswerFilterInput.limit || 10;
      const result = await this.conn.query(
        getStudentTaskAnswersQuery({
          ...taskAnswerFilterInput,
          student_ID: currentUser.user_ID,
          page,
          limit,
        }),
      );
      return this.transfromTaskAnswers(result.recordset);
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param taskAnswerFilterInput
   * @param currentUser
   * @returns
   */
  async getTaskAnswersService(
    taskAnswerFilterInput: TaskAnswersFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await getTaskAnswersPromisesQuery(
        taskAnswerFilterInput.task_ID,
        currentUser.user_ID,
        this.conn,
      );

      getTaskAnswersCheckQuery(resultPromises);

      const page = taskAnswerFilterInput.page || 1;
      const limit = taskAnswerFilterInput.limit || 10;
      const result = await this.conn.query(
        getTaskAnswersQuery({ ...taskAnswerFilterInput, page, limit }),
      );
      return this.transfromTaskAnswers(result.recordset);
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   * Uploads task answer to the database and FTP server.
   *
   * @param {TaskAnswerInput} taskAnswerInput - The answer data.
   * @param {CurrentUser} currentUser - The user who is answering the task.
   * @return {Promise<string>} A promise that resolves to a string with the
   * message indicating the success or failure of the operation.
   */
  async uploadTaskAnswerService(
    taskAnswerInput: TaskAnswerInput,
    currentUser: CurrentUser,
  ) {
    let file_path: string;
    try {
      const resultPromises = await uploadTaskAnswerPromisesQuery(
        taskAnswerInput.task_ID,
        currentUser.user_ID,
        this.conn,
      );

      uploadTaskAnswerCheckQuery(resultPromises);

      if (resultPromises[2].recordset.length > 0) {
        const { filePath } = await this.ftpService.saveFileToFtp(
          taskAnswerInput.file,
          'taskAnswer',
        );
        file_path = filePath;
        this.ftpService.deleteFileFromFtp(
          resultPromises[2].recordset[0].file_path,
        );
        await this.conn.query(
          updateTaskAnswerQuery({
            task_answer_ID: resultPromises[2].recordset[0].task_answer_ID,
            file_path: filePath,
          }),
        );
        return 'Task answer uploaded successfully';
      }

      const { filePath } = await this.ftpService.saveFileToFtp(
        taskAnswerInput.file,
        'taskAnswer',
      );
      file_path = filePath;
      await this.conn.query(
        uploadTaskAnswerQuery({
          task_answer_ID: uuid(),
          task_ID: taskAnswerInput.task_ID,
          student_ID: currentUser.user_ID,
          file_path: filePath,
        }),
      );
      return 'Task answer uploaded successfully';
    } catch (error) {
      if (file_path) {
        this.ftpService.deleteFileFromFtp(file_path);
      }
      handleError(error, errorMessage);
    }
  }

  async updateTaskAnswerService(
    taskAnswerUpdateInput: TaskAnswerUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await updateTaskAnswerPromisesQuery(
        taskAnswerUpdateInput.task_answer_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateTaskAnswerCheckQuery(resultPromises, currentUser);

      await this.conn.query(updateTaskAnswerQuery(taskAnswerUpdateInput));

      return 'Task answer updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async deleteTaskAnswerService(
    taskAnswer_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await deleteTaskAnswerPromisesQuery(
        taskAnswer_ID,
        currentUser,
        this.conn,
      );

      deleteTaskAnswerCheckQuery(resultPromises, currentUser);

      await this.conn.query(deleteOneTaskAnswerQuery(taskAnswer_ID));

      this.ftpService.deleteFileFromFtp(
        resultPromises[0].recordset[0].file_path,
      );

      return 'Task answer deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  private transfromTaskAnswers(
    taskAnswers: TaskAnswerType[],
  ): TaskAnswerType[] {
    return taskAnswers.map((taskAnswer) => {
      return {
        ...taskAnswer,
        file_path:
          'localhost:3000/files/file/taskanswer/' + taskAnswer.answer_ID,
      };
    });
  }
}
