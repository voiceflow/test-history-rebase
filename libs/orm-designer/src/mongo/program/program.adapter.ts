import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { AbstractProgramEntity } from './abstract-program.entity';

export const ProgramJSONAdapter = createSmartMultiAdapter<
  EntityObject<AbstractProgramEntity>,
  ToJSON<AbstractProgramEntity>
>(
  ({ diagramID, versionID, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(diagramID !== undefined && { diagramID: diagramID.toJSON() }),

    ...(versionID !== undefined && { versionID: versionID.toJSON() }),
  }),
  ({ diagramID, versionID, legacyID, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(diagramID !== undefined && { diagramID: new ObjectId(diagramID) }),

    ...(versionID !== undefined && { versionID: new ObjectId(versionID) }),

    ...(legacyID !== undefined && { legacyID }),
  })
);
