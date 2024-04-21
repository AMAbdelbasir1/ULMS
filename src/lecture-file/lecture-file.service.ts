import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import {
  SavedFile,
  deleteFile,
  handleError,
  validateAndSaveFiles,
} from 'src/utils';
import { errorMessage } from './message.error';
import { CurrentUser } from 'src/user/user.input';
import {
  LectureFileFilterInput,
  LectureFileInput,
  LectureFileUpdateInput,
} from './lecture-file.input';
import {
  getLectureFilesPromisesQuery,
  updateLectureFilePromisesQuery,
  uploadLectureFilePromisesQuery,
} from './promisesQuery';
import {
  getLectureFilesCheckQuery,
  updateLectureFileCheckQuery,
  uploadLectureFileCheckQuery,
} from './checkQuery';
import {
  deleteOneLectureFileQuery,
  getLecturesFilesCourseQuery,
  insertLectureFileQuery,
  updateLectureFileQuery,
} from 'src/database/queries/lecture-file.query';

@Injectable()
export class LectureFileService {
  constructor(private readonly conn: DatabaseService) {}
  /**
   *
   * @param filterInput
   * @param currentUser
   * @returns
   */
  async getLectureFilesService(
    filterInput: LectureFileFilterInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromise = await getLectureFilesPromisesQuery(
        filterInput.lecture_ID,
        currentUser,
        this.conn,
      );

      getLectureFilesCheckQuery(resultPromise, currentUser);

      const lectureFiles = await this.conn.query(
        getLecturesFilesCourseQuery(filterInput),
      );

      return lectureFiles.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param lectureFileInput
   * @param currentUser
   * @returns
   */
  async uploadLectureFilesService(
    lectureFileInput: LectureFileInput,
    currentUser: CurrentUser,
  ) {
    let fileDetails: SavedFile[];
    try {
      const { files, lecture_ID } = lectureFileInput;

      const resultPromise = await uploadLectureFilePromisesQuery(
        lecture_ID,
        currentUser.user_ID,
        this.conn,
      );

      uploadLectureFileCheckQuery(resultPromise, currentUser);

      fileDetails = await validateAndSaveFiles(files);

      const queries = fileDetails.map((file) =>
        insertLectureFileQuery({
          lecture_file_ID: uuid(),
          lecture_ID,
          instructor_ID: currentUser.user_ID,
          name: file.filename,
          extension: file.fileExtension,
          type: file.fileType,
          file_path: file.filePath,
        }),
      );

      await this.conn.executeTransaction(queries);

      return 'Lecture files uploaded successfully';
    } catch (error) {
      console.log(error);
      const deleteFilePromises = fileDetails.map((file) => {
        return deleteFile('./' + file.filePath);
      });
      Promise.all(deleteFilePromises);
      handleError(error, errorMessage);
    }
  }

  async updateLectureFileService(
    lectureFileUpdateInput: LectureFileUpdateInput,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromise = await updateLectureFilePromisesQuery(
        lectureFileUpdateInput.lecture_file_ID,
        currentUser.user_ID,
        this.conn,
      );

      updateLectureFileCheckQuery(resultPromise, currentUser);

      await this.conn.query(updateLectureFileQuery(lectureFileUpdateInput));

      return 'Lecture file updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  async deleteLectureFileService(
    lecture_file_ID: string,
    currentUser: CurrentUser,
  ) {
    try {
      const resultPromise = await updateLectureFilePromisesQuery(
        lecture_file_ID,
        currentUser.user_ID,
        this.conn,
      );
      updateLectureFileCheckQuery(resultPromise, currentUser);
      await this.conn.query(deleteOneLectureFileQuery(lecture_file_ID));
      return 'Lecture file deleted successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
