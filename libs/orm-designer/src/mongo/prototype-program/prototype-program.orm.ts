import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { PrototypeProgramEntity } from './prototype-program.entity';
import { PrototypeProgramJSONAdapter } from './prototype-program-json.adapter';

export class PrototypeProgramORM extends MongoAtomicORM<PrototypeProgramEntity> {
  Entity = PrototypeProgramEntity;

  jsonAdapter = PrototypeProgramJSONAdapter;

  async deleteOlderThanForVersion(versionID: string, date: Date) {
    await this.delete({ versionID: new ObjectId(versionID), updatedAt: { $lt: date } });
  }
}
