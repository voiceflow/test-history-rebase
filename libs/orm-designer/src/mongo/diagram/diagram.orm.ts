import { ObjectId } from '@mikro-orm/mongodb';

import { MongoAtomicORM } from '../common';
import { DiagramEntity } from './diagram.entity';
import { DiagramJSONAdapter } from './diagram-json.adapter';

export class DiagramORM extends MongoAtomicORM<DiagramEntity> {
  Entity = DiagramEntity;

  jsonAdapter = DiagramJSONAdapter;

  findManyByVersionID(versionID: string) {
    return this.find({ versionID: new ObjectId(versionID) });
  }

  findOneByVersionIDAndDiagramID(versionID: string, diagramIDs: string) {
    return this.collection.findOne({ versionID: new ObjectId(versionID), diagramID: new ObjectId(diagramIDs) });
  }

  deleteManyByVersionID(versionID: string) {
    return this.delete({ versionID: new ObjectId(versionID) });
  }

  findManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]) {
    return this.find({ versionID: new ObjectId(versionID), diagramID: diagramIDs.map((id) => new ObjectId(id)) });
  }

  deleteManyByVersionIDAndDiagramIDs(versionID: string, diagramIDs: string[]) {
    if (!diagramIDs.length) {
      return Promise.resolve(0);
    }

    return this.delete({
      versionID: new ObjectId(versionID),
      diagramID: { $in: diagramIDs.map((id) => new ObjectId(id)) },
    });
  }
}
