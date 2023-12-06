import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoObjectJSONAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { AbstractProgramEntity } from './abstract-program.entity';

export const ProgramJSONAdapter = createSmartMultiAdapter<
  EntityObject<AbstractProgramEntity>,
  ToJSON<AbstractProgramEntity>
>(
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
