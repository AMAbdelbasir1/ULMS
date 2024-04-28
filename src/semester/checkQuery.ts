import { CurrentUser } from 'src/user/user.input';
import { SemesterInput, UpdateSemesterInput } from './semester.input';
import { QueryResult } from 'src/database/database.entity';

export function createSemesterCheckQuery(
  resultPromises: [QueryResult, QueryResult],
  semesterInput: SemesterInput,
) {
  const [lastSemester, semestersPerYear] = resultPromises;
  if (semestersPerYear.recordset.length == 3) {
    throw 'FULL_YEAR';
  }
  if (semestersPerYear.recordset.length > 0) {
    for (let i = 0; i < semestersPerYear.recordset.length; i++) {
      if (semestersPerYear.recordset[i].number == semesterInput.number) {
        throw 'SEMESTER_FOUND';
      }
    }
  }
  if (
    lastSemester.recordset.length > 0 &&
    lastSemester.recordset[0].end_Date >= new Date()
  ) {
    throw 'SEMESTER_RUNING';
  }
  if (
    lastSemester.recordset[0]?.years == semesterInput.years &&
    lastSemester.recordset[0]?.number == semesterInput.number
  ) {
    throw 'SEMESTER_FOUND';
  }
}

export function updateSemesterCheckQuery(
  resultPromise: [QueryResult, QueryResult],
  updateSemesterInput: UpdateSemesterInput,
  currentUser: CurrentUser,
) {
  const [existingSemester, existingLastSemester] = resultPromise;
  if (existingSemester.recordset.length === 0) {
    throw 'SEMESTER_NOT_FOUND';
  }
  if (existingSemester.recordset[0].faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }
  if (updateSemesterInput.start_date > existingSemester.recordset[0].end_Date) {
    throw 'UNABLE_START_DATE';
  }
  if (updateSemesterInput.end_date < existingSemester.recordset[0].start_Date) {
    throw 'UNABLE_END_DATE';
  }

  if (
    existingLastSemester.recordset[0].semester_ID !=
      updateSemesterInput.semester_ID &&
    (updateSemesterInput.end_date || updateSemesterInput.start_date)
  ) {
    throw 'UNABLE_CHANGE_DATE';
  }
}

export function deleteSemesterCheckQuery(
  semester: QueryResult,
  currentUser: CurrentUser,
) {
  if (semester.recordset.length === 0) {
    throw 'SEMESTER_NOT_FOUND';
  }
  if (semester.recordset[0].Faculty_ID !== currentUser.Faculty_ID) {
    throw 'UNAUTHORIZED';
  }
}
