import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { PrototypeProgramEntity } from './prototype-program.entity';

export class PrototypeProgramORM extends MongoAtomicORM(PrototypeProgramEntity) {
  async deleteOlderThanForVersion(versionID: string, date: Date) {
    this.nativeDelete({ versionID: new ObjectId(versionID), updatedAt: { $lt: date } });
  }
}
