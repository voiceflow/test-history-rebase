import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { DiagramEntity } from './diagram.entity';

export class DiagramORM extends MongoAtomicORM(DiagramEntity) {
  findManyByVersionID(versionID: string) {
    return this.find({ versionID: new ObjectId(versionID) });
  }

  deleteManyByVersionID(versionID: string) {
    return this.em.nativeDelete(DiagramEntity, { versionID: new ObjectId(versionID) });
  }
}
