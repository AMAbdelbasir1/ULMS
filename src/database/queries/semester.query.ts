export function getOneSemeterQuery(semester_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT * FROM semester WHERE semester_ID=@semester_ID`,
    params: { semester_ID },
  };
}

export function getLastSemeterQuery(faculty_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `SELECT TOP 1 semester_ID,start_Date,end_Date FROM semester 
            WHERE faculty_ID=@faculty_ID ORDER BY created_at`,
    params: { faculty_ID },
  };
}

export function getSemetersPerYearQuery(
  faculty_ID: string,
  years: string,
): { query: string; params?: any } {
  years = '%' + years + '%';
  return {
    query: `SELECT years,number FROM semester WHERE faculty_ID=@faculty_ID AND years LIKE @years`,
    params: { faculty_ID, years },
  };
}

export function getAllSemestersQuery(
  faculty_ID: string,
  filterInput: {
    years?: string;
    number?: number;
    page?: number;
    limit?: number;
  },
): { query: string; params?: any } {
  const offset = (filterInput.page - 1) * filterInput.limit;
  let whereClause = filterInput.number ? `AND number = @number ` : '';
  whereClause += filterInput.years ? `AND years LIKE @years ` : '';
  if (filterInput.years) {
    filterInput.years = '%' + filterInput.years + '%';
  }
  const params: any = { faculty_ID, ...filterInput, offset };
  return {
    query: `SELECT semester_ID,start_Date,end_Date,years,number FROM semester 
          WHERE faculty_ID=@faculty_ID ${whereClause} ORDER BY semester_ID OFFSET @offset ROWS 
          FETCH NEXT @limit ROWS ONLY; `,
    params,
  };
}

export function insertSemesterQuery(insertInput: {
  semester_ID: string;
  faculty_ID: string;
  start_date: Date;
  end_date: Date;
  years: string;
  number: number;
}): { query: string; params?: any } {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const start_date = formatDate(insertInput.start_date);
  const end_date = formatDate(insertInput.end_date);
  return {
    query: `
    INSERT INTO semester (semester_ID,faculty_ID,start_Date,end_Date, years, number)
    VALUES
     (@semester_ID,@faculty_ID,@start_date,@end_date,@years, @number)
  `,
    params: { ...insertInput, start_date, end_date },
  };
}

export function updateSemesterQuery(updateInput: {
  semester_ID: string;
  start_date?: Date;
  end_date?: Date;
  years?: string;
  number?: number;
}): { query: string; params?: any } {
  let sqlStr = 'UPDATE semester SET ';

  for (const key in updateInput) {
    if (key !== 'semester_ID' && updateInput[key]) {
      sqlStr += `${key}=@${key},`;
    }
  }
  // Remove the trailing comma if present
  sqlStr = sqlStr.replace(/,$/, '');

  return {
    query: sqlStr + ` WHERE semester_ID=@semester_ID;`,
    params: { ...updateInput },
  };
}

export function deleteOneSemesterQuery(semester_ID: string): {
  query: string;
  params?: any;
} {
  return {
    query: `DELETE FROM semester WHERE semester_ID=@semester_ID`,
    params: { semester_ID },
  };
}
