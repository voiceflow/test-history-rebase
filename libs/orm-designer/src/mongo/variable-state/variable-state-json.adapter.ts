import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';

import type { VariableStateJSON, VariableStateObject } from './variable-state.interface';

export const VariableStateJSONAdapter = createSmartMultiAdapter<VariableStateObject, VariableStateJSON>(
  ({ projectID, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(projectID !== undefined && { projectID: projectID.toJSON() }),
  }),
  ({ projectID, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),
  })
);
