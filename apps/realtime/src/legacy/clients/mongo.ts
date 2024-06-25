import type { LoguxControl } from '@voiceflow/socket-utils';
import type { Db, MongoClient } from 'mongodb';
import Mongo from 'mongodb';

import type { BaseOptions } from './types';

class MongoDB implements LoguxControl {
  private client: MongoClient | undefined;

  public _db: Db | undefined;

  private MONGO_URI: string;

  private MONGO_DB: string;

  constructor({ config }: BaseOptions) {
    this.MONGO_URI = config.MONGO_URI;
    this.MONGO_DB = config.MONGO_DB;
  }

  async setup() {
    this.client = await Mongo.MongoClient.connect(this.MONGO_URI, {
      ignoreUndefined: true,
    });

    this._db = this.client.db(this.MONGO_DB);
  }

  get db() {
    if (!this._db) throw new Error('DB is undefined. Start client first');

    return this._db;
  }

  async destroy() {
    await this.client?.close();
  }
}

export default MongoDB;
