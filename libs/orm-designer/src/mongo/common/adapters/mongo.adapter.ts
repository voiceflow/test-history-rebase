import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { MongoEntity } from '../entities/mongo.entity';

export const MongoJSONAdapter = createSmartMultiAdapter<EntityObject<MongoEntity>, ToJSONWithForeignKeys<MongoEntity>>(
  ({ _id, ...data }) => ({
    ...data,

    ...(_id !== undefined && { _id: _id.toJSON() }),
  }),
  ({ _id, ...data }) => ({
    ...data,

    ...(_id !== undefined && { _id: new ObjectId(_id) }),
  })
);
