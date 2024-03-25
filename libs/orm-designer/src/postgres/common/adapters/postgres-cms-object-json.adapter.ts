import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { PostgresCMSObjectJSON, PostgresCMSObjectObject } from '../entities/postgres-cms-object.entity';
import { PostgresCMSCreatableJSONAdapter } from './postgres-cms-creatable-json.adapter';

export const PostgresCMSObjectJSONAdapter = createSmartMultiAdapter<PostgresCMSObjectObject, PostgresCMSObjectJSON>(
  ({ updatedAt, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);
