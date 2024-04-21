import * as sql from 'mssql';
import * as dotenv from 'dotenv';
dotenv.config();
export const databaseConfig: sql.config = {
  user: process.env.DB_USER,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
  },
  trustServerCertificate: true,
};
