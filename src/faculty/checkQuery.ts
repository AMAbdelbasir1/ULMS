import { QueryResult } from '../database/database.entity';

export function createFacultyCheckQuery(
  resultFacultyPromise: [QueryResult, QueryResult],
) {
  const [existingFaculty, existingUniversity] = resultFacultyPromise;

  if (existingFaculty.recordset.length > 0) {
    throw 'EXISTS_FACULTY';
  }

  if (existingUniversity.recordset.length === 0) {
    throw 'UNIVERSITY_NOT_FOUND';
  }
}

export function updateFacultyCheckQuery(
  resultFacultyPromise: [QueryResult, QueryResult, QueryResult],
) {
  const [existingFaculty, existingFacultyName, existingUniversity] =
    resultFacultyPromise;

  if (existingFaculty.recordset.length === 0) {
    throw 'FACULTY_NOT_FOUND';
  }

  if (existingFacultyName.recordset.length > 0) {
    throw 'EXISTS_FACULTY';
  }

  if (existingUniversity.recordset.length === 0) {
    throw 'UNIVERSITY_NOT_FOUND';
  }
}

export function deleteFacultyCheckQuery(
  resultFacultyPromise: [QueryResult, QueryResult],
) {
  const [existingFaculty, existingDepartment] = resultFacultyPromise;

  if (existingFaculty.recordset.length === 0) {
    throw 'FACULTY_NOT_FOUND';
  }
  if (existingDepartment.recordset.length > 0) {
    throw 'DEPARTMENT_FOUND';
  }
}
