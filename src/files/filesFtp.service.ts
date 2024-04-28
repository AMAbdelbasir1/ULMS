import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as http from 'http';
import { config } from 'dotenv';

import { DatabaseService } from '../database/database.service';
import { handleRouteError } from '../utils/graph.error';
import { errorMessage } from './message.error';
import {
  getLectureFilePromisesQuery,
  getTaskAnswerFilePromisesQuery,
  getTaskFilePromisesQuery,
} from './promisesQuery';
import { CurrentUser } from '../user/user.input';
import { getOneUserQuery } from '../database/queries/user.query';
import {
  getLectureFileCheckQuery,
  getTaskAnswerFileCheckQuery,
  getTaskFileCheckQuery,
} from './checkQuery';

config();

@Injectable()
export class FilesFtpService {
  constructor(private readonly conn: DatabaseService) {}
  /*************************************************
   *
   * @param userid
   * @param res
   * @returns
   */
  async viewFtpImageService(userid: string, res: Response) {
    try {
      const filePath = await this.getImagePath(userid);
      this.streamFtpFile(filePath, res);
      return;
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }
  /******************************************************
   *
   * @param fileId
   * @param res
   * @param currentUser
   * @returns
   */
  async streamFileFtpService(
    fileId: string,
    res: Response,
    currentUser: CurrentUser,
  ) {
    try {
      const filePath = await this.getFilePath(fileId, currentUser);
      this.streamFtpFile(filePath, res);
      return;
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      return res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }
  /*********************************************************
   *
   * @param fileId
   * @param res
   * @param currentUser
   * @returns
   */
  async streamFileTaskFtpService(
    fileId: string,
    res: Response,
    currentUser: CurrentUser,
  ) {
    try {
      const filePath = await this.getFileTaskPath(fileId, currentUser);
      this.streamFtpFile(filePath, res);
      return;
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      return res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }
  /***********************************************************
   *
   * @param fileId
   * @param res
   * @param currentUser
   * @returns
   */
  async streamFileTaskAnswerFtpService(
    fileId: string,
    res: Response,
    currentUser: CurrentUser,
  ) {
    try {
      const filePath = await this.getFileAnswerPath(fileId, currentUser);
      this.streamFtpFile(filePath, res);
      return;
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      return res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }
  /**************************************************************
   *
   * @param filePath
   * @param res
   */
  private async streamFtpFile(filePath: string, res: Response) {
    // Get the file from the FTP server
    const httpUrl = `${process.env.FTP_URL}${filePath}`;
    http
      .get(httpUrl, (response) => {
        // Get the content type from the response headers
        const contentType =
          response.headers['content-type'] || 'application/octet-stream';

        // console.log(response.statusCode);
        // Set the headers based on the content type
        res.setHeader('Content-Length', response.headers['content-length']);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        // res.setHeader('Cache-Control', 'no-cache');

        // Pipe the response to the client
        response.pipe(res);
      })
      .on('error', (error) => {
        // Handle HTTP request errors
        console.error('Error streaming file:', error);
        throw error;
      });
  }
  /***************************************************
   *
   * @param fileid
   * @param currentUser
   * @returns
   */
  private async getFilePath(fileid: string, currentUser: CurrentUser) {
    const resultPromises = await getLectureFilePromisesQuery(
      fileid,
      currentUser,
      this.conn,
    );
    getLectureFileCheckQuery(resultPromises);

    return resultPromises[0].recordset[0].file_path;
  }
  /***********************************************************
   *
   * @param fileid
   * @param currentUser
   * @returns
   */
  private async getFileTaskPath(fileid: string, currentUser: CurrentUser) {
    const resultPromises = await getTaskFilePromisesQuery(
      fileid,
      currentUser,
      this.conn,
    );

    getTaskFileCheckQuery(resultPromises, currentUser);

    return resultPromises[0].recordset[0].file_path;
  }
  /**************************************************
   *
   * @param fileid
   * @param currentUser
   * @returns
   */
  private async getFileAnswerPath(fileid: string, currentUser: CurrentUser) {
    const resultPromises = await getTaskAnswerFilePromisesQuery(
      fileid,
      currentUser,
      this.conn,
    );
    getTaskAnswerFileCheckQuery(resultPromises, currentUser);
    return resultPromises[0].recordset[0].file_path;
  }
  /*******************************************************
   *
   * @param userid
   * @returns
   */
  private async getImagePath(userid: string) {
    const user = await this.conn.query(getOneUserQuery(userid));
    if (user.recordset.length == 0 || user.recordset[0].image_path == null) {
      throw 'FILE_NOT_FOUND';
    }
    return user.recordset[0].image_path;
  }
}
