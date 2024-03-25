import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoObjectJSONAdapter } from '@/mongo/common';

import type { ProgramJSON, ProgramObject } from './program.interface';

export const ProgramJSONAdapter = createSmartMultiAdapter<ProgramObject, ProgramJSON>(
  ({ diagramID, versionID, ...data }) => ({
    ...MongoObjectJSONAdapter.fromDB(data),

    ...(diagramID !== undefined && { diagramID: diagramID.toJSON() }),

    ...(versionID !== undefined && { versionID: versionID.toJSON() }),
  }),
  ({ diagramID, versionID, legacyID, ...data }) => ({
    ...MongoObjectJSONAdapter.toDB(data),

    ...(diagramID !== undefined && { diagramID: new ObjectId(diagramID) }),

    ...(versionID !== undefined && { versionID: new ObjectId(versionID) }),

    ...(legacyID !== undefined && { legacyID }),
  })
);
