import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { MongoObjectJSON, MongoObjectObject } from '../entities/mongo-object.entity';
import { MongoJSONAdapter } from './mongo-json.adapter';

export const MongoObjectJSONAdapter = createSmartMultiAdapter<MongoObjectObject, MongoObjectJSON>(
  ({ updatedAt, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);
