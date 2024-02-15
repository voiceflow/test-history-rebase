import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoEntityAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { VariableStateEntity } from './variable-state.entity';

export const VariableStateEntityAdapter = createSmartMultiAdapter<
  EntityObject<VariableStateEntity>,
  ToJSON<VariableStateEntity>
>(
  ({ projectID, ...data }) => ({
    ...MongoEntityAdapter.fromDB(data),

    ...(projectID !== undefined && { projectID: projectID.toJSON() }),
  }),
  ({ projectID, ...data }) => ({
    ...MongoEntityAdapter.toDB(data),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),
  })
);
