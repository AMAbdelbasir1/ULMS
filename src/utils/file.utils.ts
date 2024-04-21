import * as fs from 'fs';
import { Stream } from 'stream';
import { promises as fsPromises } from 'fs';
// import * as path from 'path';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

export async function saveImage(
  image: FileUpload,
  folderName: string,
): Promise<string> {
  const { filename, createReadStream, mimetype } = await image;
  // console.log(image);
  const isImage = mimetype.split('/')[0];
  const path = `/uploads/${folderName}/${filename}`;
  return new Promise((resolve, reject) => {
    if (isImage !== 'image') {
      console.log('Not an image:', isImage);
      reject('NOT_IMAGE');
      return;
    }
    createReadStream()
      .pipe(fs.createWriteStream('.' + path))
      .on('finish', () => resolve(path))
      .on('error', (error) => reject(error));
  });
}

export async function deleteFile(file_path: string) {
  return new Promise<boolean>((resolve, reject) => {
    fs.access(file_path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false); // Reject with the error
      } else {
        fs.unlink(file_path, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(true); // Resolve without a value since deletion succeeded
        });
      }
    });
  });
}

export interface SavedFile {
  filename: string;
  filePath: string;
  fileExtension: string;
  fileType: string;
}

export async function validateFileSize(
  file: Promise<FileUpload>,
): Promise<void> {
  const { createReadStream } = await file;
  const stream = createReadStream();
  let fileSize = 0;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  await new Promise((resolve, reject) => {
    stream
      .on('data', (chunk) => {
        fileSize += chunk.length;
        if (fileSize > MAX_FILE_SIZE) {
          reject('MAX_FILE_SIZE');
        }
      })
      .on('error', reject)
      .on('end', resolve);
  });
}

export function extractFileName(fileName: string): string {
  // Use regular expression to match the filename without extension
  const regex = /^(.*?)\.[^.]*$/;
  const match = regex.exec(fileName);

  if (match && match.length > 1) {
    return match[1];
  } else {
    // If no match found, return the original filename
    return fileName;
  }
}

async function saveFile(file: Promise<FileUpload>): Promise<SavedFile> {
  // const uploadDir = path.join(__dirname, 'uploads', 'lecture-files');
  const { createReadStream, filename, mimetype } = await file;
  const stream = createReadStream();
  const filePath = `/uploads/lecture-files/${Date.now()}-${filename}`;
  const writeStream = fs.createWriteStream('./' + filePath);
  const fileType = mimetype.split('/')[0];
  const fileExtension = filename.split('.').pop();
  return new Promise((resolve, reject) => {
    stream
      .pipe(writeStream)
      .on('finish', () =>
        resolve({
          filename: extractFileName(filename),
          filePath,
          fileExtension,
          fileType,
        }),
      )
      .on('error', (error) => {
        fsPromises.unlink(filePath).catch((err) => {
          reject(err);
        }); // Attempt to delete the file on error
        reject(error);
      });
  });
}

export async function validateAndSaveFiles(
  files: Promise<FileUpload>[],
): Promise<SavedFile[]> {
  // Validate file sizes before attempting to save
  for (const file of files) {
    await validateFileSize(file);
  }

  // Save files in parallel
  const uploadFilePromises = files.map((file) => saveFile(file));

  // Wait for all promises to settle
  const results = await Promise.allSettled(uploadFilePromises);
  // console.log(results);
  // Check if any of the promises were rejected
  const rejected = results.some((result) => result.status === 'rejected');
  if (rejected) {
    // If there are any rejections, delete all successfully saved files
    const deletionPromises = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) =>
        deleteFile(
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
}
