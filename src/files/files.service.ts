import { Injectable } from '@nestjs/common';
import { createReadStream, statSync } from 'fs';
import * as mime from 'mime-types';
import * as rangeParser from 'range-parser';
import { Response, Request } from 'express';

import { DatabaseService } from '../database/database.service';
import { handleRouteError } from '../utils/graph.error';
import { errorMessage } from './message.error';
import { getLectureFilePromisesQuery } from './promisesQuery';
import { CurrentUser } from '../user/user.input';
import { getOneUserQuery } from '../database/queries/user.query';
import { getLectureFileCheckQuery } from './checkQuery';
@Injectable()
export class FilesService {
  constructor(private readonly conn: DatabaseService) {}
  async viewImageService(userid: string, req: Request, res: Response) {
    try {
      const filePath = await this.getImagePath(userid);
      const range = req.headers.range || 'bytes=0-';

      const { fileStream, headers } = this.getFileStream(filePath, range);
      res.writeHead(206, headers); // Partial content
      fileStream.pipe(res);
      return;
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }

  async streamVideoService(
    fileId: string,
    req: Request,
    res: Response,
    currentUser: CurrentUser,
  ) {
    try {
      const filePath = await this.getFilePath(fileId, currentUser);
      const range = req.headers.range || 'bytes=0-';

      const { fileStream, headers } = this.getFileStream(filePath, range);
      res.writeHead(206, headers); // Partial content
      fileStream.pipe(res);
    } catch (error) {
      const err = handleRouteError(error, errorMessage);
      res.status(Number(err.code)).json({
        message: err.message,
        code: err.code,
      });
    }
  }

  getFileStream(filePath: string, range: string) {
    const videoStat = this.getFileStats(filePath);
    const fileSize = videoStat.size;
    const positions = rangeParser(fileSize, range, { combine: true });

    const start = positions[0].start;
    const end = positions[0].end;
    const chunkSize = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': this.getMimeType(filePath),
    };
    const fileStream = createReadStream('./' + filePath, { start, end });
    return { fileStream, headers };
  }

  private async getFilePath(fileid: string, currentUser: CurrentUser) {
    const resultPromises = await getLectureFilePromisesQuery(
      fileid,
      currentUser,
      this.conn,
    );
    getLectureFileCheckQuery(resultPromises);

    return resultPromises[0].recordset[0].file_path;
  }

  private async getImagePath(userid: string) {
    const user = await this.conn.query(getOneUserQuery(userid));
    if (user.recordset.length == 0 || user.recordset[0].image_path == null) {
      throw 'FILE_NOT_FOUND';
    }
    return user.recordset[0].image_path;
  }

  private getFileStats(filePath: string) {
    return statSync('./' + filePath);
  }

  private getMimeType(filePath: string) {
    return mime.lookup('./' + filePath) || 'application/octet-stream';
  }
}
