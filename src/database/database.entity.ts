type Record = {
  [key: string]: string | number | Date | boolean;
};

export interface QueryResult {
  recordsets: Record[][];
  recordset: Record[];
  output: any;
  rowsAffected: number[];
}
