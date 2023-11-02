import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { VariableStateEntity } from './variable-state.entity';

export const VariableStateJSONAdapter = createSmartMultiAdapter<
  EntityObject<VariableStateEntity>,
  ToJSON<VariableStateEntity>
>(
  ({ projectID, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(projectID !== undefined && { projectID: projectID.toJSON() }),
  }),
  ({ projectID, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),
  })
);
