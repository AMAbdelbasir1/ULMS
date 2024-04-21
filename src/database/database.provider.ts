import { Provider } from '@nestjs/common';
import * as sql from 'mssql';
import { databaseConfig } from './database.config';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: async () => {
    const pool = new sql.ConnectionPool(databaseConfig);
    await pool.connect();
    console.log('Connected to MSSQL database');
    return pool;
  },
};