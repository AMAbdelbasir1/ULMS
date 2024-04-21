import { Injectable, Inject } from '@nestjs/common';
import * as sql from 'mssql';
import { DATABASE_CONNECTION } from './database.provider';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: sql.ConnectionPool,
  ) {}

  async query(queryObject: { query: string; params?: any }): Promise<any> {
    try {
      const request = await this.pool.request();
      const { query, params } = queryObject;
      if (params) {
        for (const key in params) {
          request.input(key, params[key]);
        }
      }
      const result = await request.query(query);
      return result;
    } catch (error) {
      console.error('Error querying database:', error);
      throw error;
    }
  }

  async executeTransaction(
    queries: { query: string; params?: any }[],
  ): Promise<void> {
    const transaction = new sql.Transaction(this.pool);
    try {
      await transaction.begin();

      for (const { query, params } of queries) {
        const request = new sql.Request(transaction);
        if (params) {
          for (const key in params) {
            request.input(key, params[key]);
          }
        }
        await request.query(query);
      }

      await transaction.commit();
    } catch (error) {
      console.error('Error executing transaction:', error);
      await transaction.rollback();
      throw error;
    }
  }

  async close() {
    try {
      await this.pool.close();
      console.log('Connection to MSSQL closed');
    } catch (error) {
      console.error('Error closing MSSQL connection:', error);
      throw error;
    }
  }
}
