import {
  FileUpload,
  SavedFile,
  extractFileName,
  validateFileSize,
} from 'src/utils/file.utils';
import * as ftp from 'promise-ftp';
import { config } from 'dotenv';

config();
const ftpClient: ftp = new ftp();

export async function saveFtpFile(
  file: Promise<FileUpload>,
  folderName: string,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isConnect: boolean = true,
): Promise<SavedFile> {
  const { createReadStream, filename, mimetype } = await file;
  const filePath = `/uploads/${folderName}/${Date.now()}-${filename}`;
  const fileType = mimetype.split('/')[0];
  const fileExtension = filename.split('.').pop();

  if (isConnect) {
    await connectToFtp();
  }
  return new Promise((resolve, reject) => {
    ftpClient.put(createReadStream(), '/wwwroot' + filePath, (err: Error) => {
      if (err) {
        console.error('Error uploading file:', err);
        if (isConnect) {
          disconnectFromFtp();
        }
        reject(err);
      } else {
        console.log('File uploaded successfully');
        if (isConnect) {
          disconnectFromFtp();
        }

        resolve({
          filename: extractFileName(filename),
          filePath,
          fileExtension,
          fileType,
        });
      }
    });
  });
}

export async function filesFtpSave(
  files: Promise<FileUpload>[],
  folderName: string,
): Promise<SavedFile[]> {
  try {
    for (const file of files) {
      await validateFileSize(file);
    }
    await connectToFtp();

    const uploadPromises = files.map(async (file: Promise<FileUpload>) =>
      saveFtpFile(file, folderName, false),
    );

    const results = await Promise.allSettled(uploadPromises);
    console.log(results);
    // Check if any of the promises were rejected
    const rejected = results.some((result) => result.status === 'rejected');
    if (rejected) {
      // If there are any rejections, delete all successfully saved files
      const deletionPromises = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) =>
          deleteFileFtp(
            '/wwwroot' +
              (result as PromiseFulfilledResult<SavedFile>).value.filePath,
          ),
        );
      await Promise.allSettled(deletionPromises);

      // Throw an error indicating that not all files were saved
      throw new Error(
        'Not all files were saved successfully. Any saved files have been deleted.',
      );
    }

    // If all promises were fulfilled, extract and return the saved file information
    return results.map(
      (result) => (result as PromiseFulfilledResult<SavedFile>).value,
    );
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await disconnectFromFtp();
  }
}

export async function deleteFileFtp(filePath: string): Promise<string> {
  try {
    await connectToFtp();
    await ftpClient.delete(`/wwwroot${filePath}`);
    return 'File deleted successfully';
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  } finally {
    await disconnectFromFtp();
  }
}
export async function connectToFtp(): Promise<void> {
  await ftpClient.connect({
    host: process.env.FTP_HOST,
    port: 21,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  });
}

export async function disconnectFromFtp(): Promise<void> {
  await ftpClient.end();
}
