import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { MongoJSON, MongoObject } from '../entities/mongo.entity';

export const MongoJSONAdapter = createSmartMultiAdapter<MongoObject, MongoJSON>(
  ({ _id, ...data }) => ({
    ...data,

    ...(_id !== undefined && { _id: _id.toJSON() }),
  }),
  ({ _id, ...data }) => ({
    ...data,

    ...(_id !== undefined && { _id: new ObjectId(_id) }),
  })
);
