import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';

import type { DiagramJSON, DiagramObject } from './diagram.interface';

export const DiagramJSONAdapter = createSmartMultiAdapter<DiagramObject, DiagramJSON>(
  ({ diagramID, versionID, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(diagramID !== undefined && { diagramID: diagramID.toJSON() }),

    ...(versionID !== undefined && { versionID: versionID.toJSON() }),
  }),
  ({ diagramID, versionID, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(diagramID !== undefined && { diagramID: new ObjectId(diagramID) }),

    ...(versionID !== undefined && { versionID: new ObjectId(versionID) }),
  })
);
