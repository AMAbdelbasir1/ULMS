import { DatabaseService } from 'src/database/database.service';
import { getAllDepartmentQuery } from 'src/database/queries/department.query';
import {
  getFacultyByNameQuery,
  getOneFacultyQuery,
} from 'src/database/queries/faculty.query';
import { getOneUniversityQuery } from 'src/database/queries/university.query';

export async function createFacultyPromisesQuery(
  insertInput: { university_ID: string; name: string; levels?: number },
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(
      getFacultyByNameQuery(insertInput.name, insertInput.university_ID),
    ),
    conn.query(getOneUniversityQuery(insertInput.university_ID)),
  ]);
}
export async function updateFacultyPromisesQuery(
  updateFacultyInput: {
    university_ID?: string;
    name?: string;
    levels?: number;
    last_semester_ID?: string;
    faculty_ID: string;
  },
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneFacultyQuery(updateFacultyInput.faculty_ID)),
    (async () => {
      if (updateFacultyInput.name) {
        return conn.query(
          getFacultyByNameQuery(
            updateFacultyInput.name,
            updateFacultyInput.university_ID,
          ),
        );
      }
      return { recordset: [{ found: 'found' }] };
    })(),
    (async () => {
      if (updateFacultyInput.university_ID) {
        return conn.query(
          getOneUniversityQuery(updateFacultyInput.university_ID),
        );
      }
      return { recordset: [{ found: 'found' }] };
    })(),
  ]);
}

export async function deleteFacultyPromisesQuery(
  faculty_ID: string,
  conn: DatabaseService,
) {
  return Promise.all([
    conn.query(getOneFacultyQuery(faculty_ID)),
    conn.query(getAllDepartmentQuery(1, 1, faculty_ID)),
  ]);
}
