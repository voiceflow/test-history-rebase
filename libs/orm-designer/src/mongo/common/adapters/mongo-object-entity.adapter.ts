import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { MongoObjectEntity } from '../entities/mongo-object.entity';
import { MongoEntityAdapter } from './mongo-entity.adapter';

export const MongoObjectEntityAdapter = createSmartMultiAdapter<
  EntityObject<MongoObjectEntity>,
  ToJSONWithForeignKeys<MongoObjectEntity>
>(
  ({ updatedAt, ...data }) => ({
    ...MongoEntityAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...MongoEntityAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);
