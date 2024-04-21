import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as ftp from 'promise-ftp';
import {config} from 'dotenv';
import {
  FileUpload,
  SavedFile,
  extractFileName,
  validateFileSize,
} from 'src/utils/file.utils';

@Injectable()
export class FtpTestService implements OnModuleInit, OnModuleDestroy {
  private ftpClient: ftp;

  async onModuleInit() {
    try {
      this.ftpClient = new ftp();
      await this.connectToFtp();
      console.log('Connected to FTP successfully');
    } catch (error) {
      console.error('Failed to connect to FTP:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.disconnectFromFtp();
    } catch (error) {
      console.error('Failed to disconnect from FTP:', error);
    }
  }

  private async connectToFtp(): Promise<void> {
    config();
    await this.ftpClient.connect({
      host:  process.env.FTP_HOST,
      port: 21,
      user:  process.env.FTP_USER,
      password:  process.env.FTP_PASSWORD,
    });
  }

  private async disconnectFromFtp(): Promise<void> {
    await this.ftpClient.end();
  }
  async fileExists(filePath: string): Promise<boolean> {
    try {
      // Attempt to retrieve file metadata

      await this.ftpClient.size(filePath);
      return true; // If the file's metadata can be retrieved, it exists
    } catch (error) {
      if (error.code === 550) {
        // If the error code is 550 (File not found), the file does not exist
        return false;
      }
      throw error; // If any other error occurs, re-throw it
    }
  }
  async saveFileToFtp(
    file: Promise<FileUpload>,
    folderName: string,
  ): Promise<SavedFile> {
    const { createReadStream, filename, mimetype } = await file;
    const filePath = `/uploads/${folderName}/${Date.now()}-${filename}`;
    const fileType = mimetype.split('/')[0];
    const fileExtension = filename.split('.').pop();

    return new Promise((resolve, reject) => {
      this.ftpClient.put(
        createReadStream(),
        '/wwwroot' + filePath,
        (err: Error) => {
          if (err) {
            console.error('Error uploading file:', err);
            reject(err);
          } else {
            console.log('File uploaded successfully');
            resolve({
              filename: extractFileName(filename),
              filePath,
              fileExtension,
              fileType,
            });
          }
        },
      );
    });
  }

  async deleteFileFromFtp(filePath: string): Promise<void> {
    try {
      if (!(await this.fileExists(filePath))) {
        return;
      }

      await this.ftpClient.delete(`/wwwroot${filePath}`);
      console.log('File deleted successfully');
    } catch (error) {
      throw error;
    }
  }

  async uploadFilesToFtp(
    files: Promise<FileUpload>[],
    folderName: string,
  ): Promise<SavedFile[]> {
    try {
      for (const file of files) {
        await validateFileSize(file);
      }

      const uploadPromises = files.map(async (file: Promise<FileUpload>) =>
        this.saveFileToFtp(file, folderName),
      );

      const results = await Promise.allSettled(uploadPromises);

      const rejected = results.some((result) => result.status === 'rejected');
      if (rejected) {
        const deletionPromises = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) =>
            this.deleteFileFromFtp(
              '/wwwroot' +
                (result as PromiseFulfilledResult<SavedFile>).value.filePath,
            ),
          );
        await Promise.allSettled(deletionPromises);

        throw new Error(
          'Not all files were uploaded successfully. Any uploaded files have been deleted.',
        );
      }

      return results.map(
        (result) => (result as PromiseFulfilledResult<SavedFile>).value,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { FileUpload } from 'src/utils/file.utils';
// import { Client } from 'basic-ftp';
// import { Readable } from 'stream';
// @Injectable()
// export class FtpTestService {
//   async fileFtpservice(file: FileUpload) {
//     const { createReadStream, filename } = file;

//     const client = new Client();
//     client.ftp.verbose = true;

//     try {
//       await client.access({
//         host: 'site1473.siteasp.net',
//         port: 21,
//         user: 'site1473',
//         password: '6s?QP#7o%bS8',
//         // secure: false,
//       });

//       const readStream = createReadStream();
//       const uploadStream = new Readable({
//         read() {
//           // no-op
//         },
//         objectMode: true,
//         highWaterMark: 16 * 1024,
//       });

//       readStream.on('data', (chunk) => {
//         uploadStream.push(chunk);
//       });

//       readStream.on('end', () => {
//         uploadStream.push(null);
//       });

//       await client.uploadFrom(uploadStream, `/uploads/test/${filename}`);
//       return 'File uploaded successfully: ' + filename;
//     } catch (err) {
//       console.error('Error uploading file:', err);
//       throw err;
//     } finally {
//       client.close();
//     }
//   }

//   async deleteFileFtpservice(filename: string) {
//     const client = new Client();
//     client.ftp.verbose = true;

//     try {
//       await client.access({
//         host: 'site1473.siteasp.net',
//         port: 21,
//         user: 'site1473',
//         password: '6s?QP#7o%bS8',
//       });
//       await client.remove(`/uploads/test/${filename}`);
//       return 'File deleted successfully: ' + filename;
//     } catch (err) {
//       console.error('Error deleting file:', err);
//       throw err;
//     } finally {
//       client.close();
//     }
//   }

// }
