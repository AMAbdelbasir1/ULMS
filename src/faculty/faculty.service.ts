import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from 'src/database/database.service';
import {
  FacultyFilterInput,
  FacultyInput,
  FacultyUpdateInput,
} from './faculty.input';
import { deleteFile, handleError, saveImage } from 'src/utils';

import {
  deleteOneFacultyQuery,
  getAllFacultyQuery,
  insertFacultyQuery,
  updateFacultyQuery,
} from '../database/queries/faculty.query';
import { errorMessage } from './message.error';
import {
  createFacultyPromisesQuery,
  deleteFacultyPromisesQuery,
  updateFacultyPromisesQuery,
} from './promisesQuery';
import {
  createFacultyCheckQuery,
  deleteFacultyCheckQuery,
  updateFacultyCheckQuery,
} from './checkQuery';

@Injectable()
export class FacultyService {
  constructor(private readonly conn: DatabaseService) {}

  async getFaculitiesService(facultyFilterInput: FacultyFilterInput) {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, university_ID } = facultyFilterInput;
      page = page || 1; // Default to page 1 if not provided
      limit = limit || 10; // Default to a limit of 10 if not provided
      const faculties = await this.conn.query(
        getAllFacultyQuery(page, limit, university_ID || null),
      );
      return faculties.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async createFacultyService(facultyInput: FacultyInput) {
    const { logo, ...insertInput } = facultyInput;
    let logoPath;
    try {
      const resultFacultyPromise = await createFacultyPromisesQuery(
        insertInput,
        this.conn,
      );

      createFacultyCheckQuery(resultFacultyPromise);

      logoPath = await saveImage(logo, 'faculty');
      const Faculty_ID = uuid();
      await this.conn.query(
        insertFacultyQuery(Faculty_ID, insertInput, logoPath),
      );
      return 'insert new faculty successfuly';
    } catch (error) {
      if (logoPath) {
        await deleteFile('./' + logoPath);
      }
      handleError(error, errorMessage);
    }
  }

  async updateFacultyService(facultyUpdateInput: FacultyUpdateInput) {
    let logoPath;
    const { faculty_ID, logo, ...updateInput } = facultyUpdateInput;
    try {
      if (Object.keys(updateInput).length === 0 && !logo) {
        throw 'ENTER_DATA';
      }

      const resultFacultyPromise = await updateFacultyPromisesQuery(
        { faculty_ID, ...updateInput },
        this.conn,
      );
      updateFacultyCheckQuery(resultFacultyPromise);

      if (facultyUpdateInput.logo) {
        logoPath = await saveImage(logo, 'faculty');
      }

      await this.conn.query(
        updateFacultyQuery({
          Faculty_ID: faculty_ID,
          ...updateInput,
          Logo_path: logoPath,
        }),
      );
      return 'update faculty successfuly';
    } catch (error) {
      if (logoPath) {
        await deleteFile('./' + logoPath);
      }
      handleError(error, errorMessage);
    }
  }

  async deleteFacultyService(faculty_ID: string) {
    try {
      const resultFacultyPromise = await deleteFacultyPromisesQuery(
        faculty_ID,
        this.conn,
      );

      deleteFacultyCheckQuery(resultFacultyPromise);

      if (resultFacultyPromise[0].recordset[0].Logo_path) {
        await deleteFile(resultFacultyPromise[0].recordset[0].Logo_path);
      }

      await this.conn.query(deleteOneFacultyQuery(faculty_ID));

      return 'Faculty delete successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
