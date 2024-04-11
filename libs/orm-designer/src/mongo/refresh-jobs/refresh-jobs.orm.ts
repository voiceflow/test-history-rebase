import { ObjectId } from '@mikro-orm/mongodb';

import { Atomic, MongoAtomicORM } from '../common';
import { RefreshJobsEntity } from './refresh-jobs.entity';
import { RefreshJobsJsonAdapter } from './refresh-jobs-json.adapter';

export class RefreshJobsOrm extends MongoAtomicORM<RefreshJobsEntity> {
  Entity = RefreshJobsEntity;

  jsonAdapter = RefreshJobsJsonAdapter;

  async updateChecksum(projectID: string, documentID: string, checksum: string) {
    await this.findAndAtomicUpdate({ projectID: new ObjectId(projectID), documentID: new ObjectId(documentID) }, [
      Atomic.Set([{ path: [checksum], value: checksum }]),
    ]);
  }
}
