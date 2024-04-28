import { Controller, Get, Param, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { FilesService } from './files.service';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthRouteGuard } from '../auth/guard/auth.guard';
import { RolesRouteGuard } from '../auth/guard/roles.guard';
import { GetCurrentUser } from '../auth/decorator/user.decorator';
import { CurrentUser } from '../user/user.input';
import { FilesFtpService } from './filesFtp.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly filesFtpService: FilesFtpService,
  ) {}

  @Get('image/:imageid')
  @UseGuards(AuthRouteGuard)
  viewImage(
    @Param('imageid') imageid: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.filesService.viewImageService(imageid, req, res);
  }

  @Get('file/:fileId')
  @UseGuards(AuthRouteGuard, RolesRouteGuard)
  @Roles('DOCTOR', 'STUDENT', 'ASSISTANT')
  async streamVideo(
    @Param('fileId') fileId: string,
    @Req() req: Request,
    @Res() res: Response,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.filesService.streamVideoService(fileId, req, res, currentUser);
  }

  //stream image from ftp
  @Get('image/ftp/:imageid')
  @UseGuards(AuthRouteGuard)
  viewImageFtp(@Param('imageid') imageid: string, @Res() res: Response) {
    return this.filesFtpService.viewFtpImageService(imageid, res);
  }

  @Get('file/ftp/:fileid')
  @UseGuards(AuthRouteGuard, RolesRouteGuard)
  @Roles('DOCTOR', 'STUDENT', 'ASSISTANT')
  async streamFile(
    @Param('fileid') fileid: string,
    @Res() res: Response,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return await this.filesFtpService.streamFileFtpService(
      fileid,
      res,
      currentUser,
    );
  }

  @Get('file/task/:taskid')
  @UseGuards(AuthRouteGuard, RolesRouteGuard)
  @Roles('DOCTOR', 'STUDENT', 'ASSISTANT')
  async streamTaskFile(
    @Param('taskid') taskid: string,
    @Res() res: Response,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return await this.filesFtpService.streamFileTaskFtpService(
      taskid,
      res,
      currentUser,
    );
  }

  @Get('file/taskanswer/:taskanswerid')
  @UseGuards(AuthRouteGuard, RolesRouteGuard)
  @Roles('DOCTOR', 'STUDENT', 'ASSISTANT')
  async streamTaskAnswerFile(
    @Param('taskanswerid') taskanswerid: string,
    @Res() res: Response,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return await this.filesFtpService.streamFileTaskAnswerFtpService(
      taskanswerid,
      res,
      currentUser,
    );
  }
}

// for download file
// res.setHeader('Content-Type', 'application/octet-stream');
// res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
