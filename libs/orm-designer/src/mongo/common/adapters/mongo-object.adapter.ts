import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { MongoObjectEntity } from '../entities/mongo-object.entity';
import { MongoJSONAdapter } from './mongo.adapter';

export const MongoObjectJSONAdapter = createSmartMultiAdapter<
  EntityObject<MongoObjectEntity>,
  ToJSONWithForeignKeys<MongoObjectEntity>
>(
  ({ updatedAt, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);
