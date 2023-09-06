import type { LoguxControl } from '@voiceflow/socket-utils';
import { Client, QueryConfig, QueryResult } from 'pg';

import { BaseOptions } from './types';

class PostgresDB implements LoguxControl {
  private client: Client | undefined;

  private PG_HOST: string;

  private PG_DB: string;

  private PG_USER: string;

  private PG_PASSWORD: string;

  constructor({ config }: BaseOptions) {
    this.PG_HOST = config.POSTGRES_HOST;
    this.PG_DB = config.POSTGRES_DATABASE;
    this.PG_USER = config.POSTGRES_USERNAME;
    this.PG_PASSWORD = config.POSTGRES_PASSWORD;
  }

  async setup() {
    this.client = new Client({
      host: this.PG_HOST,
      database: this.PG_DB,
      user: this.PG_USER,
      password: this.PG_PASSWORD,
    });
  }

  async _getConnectedClient(): Promise<Client> {
    if (!this.client) throw new Error('DB is undefined. Start client first');
    await this.client.connect();
    return this.client;
  }

  get queryBuilder() {
    if (!this.client) throw new Error('DB is undefined. Start client first');
    return this.client.query;
  }

  async query(value: QueryConfig<any[]>) {
    const client = await this._getConnectedClient();

    const result = await client.query(value);

    await client.end();

    return result;
  }

  async createTransaction(queries: Promise<QueryResult<any>>[]) {
    const client = await this._getConnectedClient();

    try {
      await client.query('BEGIN');

      await Promise.all(queries);

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.end();
    }
  }

  async destroy() {
    await this.client?.end();
  }
}

export default PostgresDB;
