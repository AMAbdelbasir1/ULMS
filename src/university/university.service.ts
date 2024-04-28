import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import { universityUpdateInput } from './university.input';
import { FileUpload, deleteFile, handleError, saveImage } from '../utils';
import {
  deleteOneUniversityQuery,
  getAllUniversityQuery,
  getOneUniversityQuery,
  getUniversityByNameQuery,
  insertUniversityQuery,
  updateUniversityQuery,
} from '../database/queries/university.query';
import { getAllFacultyQuery } from '../database/queries/faculty.query';
import { errorMessage } from './message.error';

@Injectable()
export class UniversityService {
  constructor(private readonly conn: DatabaseService) {}
  /**
   *
   * @returns
   */
  async getUnvirsitiesService() {
    try {
      const universities = await this.conn.query(getAllUniversityQuery());
      return universities.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async getOneUnvirsityService(university_ID: string) {
    try {
      const universities = await this.conn.query(
        getOneUniversityQuery(university_ID),
      );
      return universities.recordset[0];
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   * @param name
   * @param logo
   * @returns
   */

  async createUniversityService(name: string, logo: FileUpload) {
    try {
      const existingUniversity = await this.conn.query(
        getUniversityByNameQuery(name),
      );
      if (existingUniversity.recordset.length > 0) {
        throw 'EXISTS_UNIVERSITY';
      }
      // Save the image file and get the path
      const logoPath = await saveImage(logo, 'university');

      // Insert the new university with the logo path
      const un_ID: string = uuid();
      await this.conn.query(insertUniversityQuery(un_ID, name, logoPath));

      return 'create unvirsty successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  /**
   * @param updateInput
   * @returns
   */
  async updateUniversityService(updateInput: universityUpdateInput) {
    try {
      if (!updateInput.name && !(await updateInput.logo)) {
        throw 'ENTER_DATA';
      }
      const existingUniversity = await this.conn.query(
        getOneUniversityQuery(updateInput.university_ID),
      );
      // Save the image file and get the path
      if (existingUniversity.recordset.length === 0) {
        throw 'UNIVERSITY_NOT_FOUND';
      }
      let logoPath;

      if (await updateInput.logo) {
        logoPath = await saveImage(await updateInput.logo, 'university');
      }

      await this.conn.query(
        updateUniversityQuery({
          ID: updateInput.university_ID,
          name: updateInput.name,
          logo: logoPath,
        }),
      );

      return 'update unvirsty successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
  /**
   *
   * @param university_ID
   * @returns
   */
  async deleteUniversityService(university_ID: string) {
    try {
      const [existingUniversity, existingFaculties] = await Promise.all([
        this.conn.query(getOneUniversityQuery(university_ID)),
        this.conn.query(getAllFacultyQuery(1, 1, university_ID)),
      ]);
      if (existingUniversity.recordset.length === 0) {
        throw 'UNIVERSITY_NOT_FOUND';
      }
      if (existingFaculties.recordset.length > 0) {
        throw 'EXISIT_FACULTY';
      }
      if (existingUniversity.recordset[0].Logo_path) {
        await deleteFile(existingUniversity.recordset[0].Logo_path);
      }

      await this.conn.query(deleteOneUniversityQuery(university_ID));
      return 'University delete successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
