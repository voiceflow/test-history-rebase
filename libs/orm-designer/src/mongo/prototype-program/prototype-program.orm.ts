import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { PrototypeProgramJSONAdapter } from './prototype-program.adapter';
import { PrototypeProgramEntity } from './prototype-program.entity';

export class PrototypeProgramORM extends MongoAtomicORM(PrototypeProgramEntity) {
  async upsertMany(programs: PrototypeProgramEntity[]) {
    await this.em.getCollection(PrototypeProgramEntity).bulkWrite(
      programs.map((doc) => {
        const program = { ...PrototypeProgramJSONAdapter.toDB(doc.toJSON()) } as any;

        delete program._id;
        delete program.id;

        return {
          updateOne: {
            filter: { versionID: doc.versionID, diagramID: doc.diagramID },
            update: { $set: program },
            upsert: true,
          },
        };
      })
    );
  }

  async deleteOlderThanForVersion(versionID: string, date: Date) {
    this.em.nativeDelete(PrototypeProgramEntity, { versionID: new ObjectId(versionID), updatedAt: { $lt: date } });
  }
}
