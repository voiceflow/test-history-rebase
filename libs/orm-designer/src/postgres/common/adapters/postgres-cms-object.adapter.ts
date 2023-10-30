import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCMSObjectEntity } from '../entities/postgres-cms-object.entity';
import { PostgresCMSCreatableJSONAdapter } from './postgres-cms-creatable.adapter';

export const PostgresCMSObjectJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCMSObjectEntity>,
  ToJSONWithForeignKeys<PostgresCMSObjectEntity>
>(
  ({ updatedAt, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...PostgresCMSCreatableJSONAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);
