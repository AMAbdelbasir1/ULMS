import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { handleError } from '../utils';
import { errorMessage } from './message.error';
import { CurrentUser } from '../user/user.input';
import {
  LectureFilterInput,
  LectureInput,
  LectureUpdateInput,
} from './lecture.input';
import {
  deleteOneLectureQuery,
  getLecturesCourseQuery,
  insertLectureQuery,
  updateLectureQuery,
} from '../database/queries/lecture.query';
import {
  createLecturesCoursePromisesQuery,
  // deleteLecturePromisesQuery,
  getLecturesPromisesQuery,
  updateLecturePromisesQuery,
} from './promisesQuery';
import {
  createLectureCheckQuery,
  getLecturesCheckQuery,
  updateLectureCheckQuery,
} from './checkQuery';

@Injectable()
export class LectureService {
  constructor(private readonly conn: DatabaseService) {}
  /**
   *
   * @param lectureFilterInput
   * @param currentUser
   * @returns
   */
  async getLecturesService(
    lectureFilterInput: LectureFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const { page, limit, ...filterInput } = lectureFilterInput;

      const resultPromises = await getLecturesPromisesQuery(
        filterInput.course_cycle_ID,
        currentUser,
        this.conn,
      );
      getLecturesCheckQuery(resultPromises, currentUser);
      const pageFiletr = page || 1;
      const limitFilter = limit || 20;

      const lectures = await this.conn.query(
        getLecturesCourseQuery({
          ...filterInput,
          page: pageFiletr,
          limit: limitFilter,
        }),
      );
      return lectures.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param lectureInput
   * @param currentUser
   * @returns
   */
  async createLectureService(
    lectureInput: LectureInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromises = await createLecturesCoursePromisesQuery(
        lectureInput.course_cycle_ID,
        currentUser.user_ID,
        this.conn,
      );

      createLectureCheckQuery(resultPromises, currentUser);
      if (currentUser.roles.includes('ASSISTANT')) {
        lectureInput.type = 'Lab';
      }

      await this.conn.query(
        insertLectureQuery({
          lecture_ID: uuid(),
          instructor_ID: currentUser.user_ID,
          ...lectureInput,
        }),
      );

      return 'Lecture created successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async updateLectureService(
    lectureUpdateInput: LectureUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { lecture_ID, ...updateInput } = lectureUpdateInput;

      if (Object.keys(updateInput).length === 0) {
        throw 'ENTER_DATA';
      }

      const resultPromises = await updateLecturePromisesQuery(
        lectureUpdateInput.lecture_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateLectureCheckQuery(resultPromises, currentUser);

      if (
        currentUser.roles.includes('ASSISTANT') &&
        updateInput?.type !== 'Lab'
      ) {
        throw 'CAN_NOT_CHANGE';
      }

      await this.conn.query(updateLectureQuery(lectureUpdateInput));

      return 'Lecture updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async deleteLectureService(lecture_ID: string, currentUser: CurrentUser) {
    try {
      const resultPromises = await updateLecturePromisesQuery(
        lecture_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateLectureCheckQuery(resultPromises, currentUser);

      await this.conn.query(deleteOneLectureQuery(lecture_ID));

      return 'Lecture deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
