import { DatabaseService } from 'src/database/database.service';
import {
  getLastSemeterQuery,
  getOneSemeterQuery,
  getSemetersPerYearQuery,
} from 'src/database/queries/semester.query';

import { CurrentUser } from 'src/user/user.input';
import { SemesterInput, UpdateSemesterInput } from './semester.input';

export async function createSemesterPromisesQuery(
  semesterInput: SemesterInput,
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  return Promise.all([
    conn.query(getLastSemeterQuery(currentUser.Faculty_ID)),
    conn.query(
      getSemetersPerYearQuery(currentUser.Faculty_ID, semesterInput.years),
    ),
  ]);
}

export async function updateSemesterPromisesQuery(
  updateSemesterInput: UpdateSemesterInput,
  conn: DatabaseService,
  currentUser: CurrentUser,
) {
  return Promise.all([
    conn.query(getOneSemeterQuery(updateSemesterInput.semester_ID)),
    conn.query(getLastSemeterQuery(currentUser.Faculty_ID)),
  ]);
}
