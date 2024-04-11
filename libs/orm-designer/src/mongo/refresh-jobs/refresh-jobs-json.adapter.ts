import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';

import type { RefreshJobsJSON, RefreshJobsObject } from './refresh-jobs.interface';

export const RefreshJobsJsonAdapter = createSmartMultiAdapter<RefreshJobsObject, RefreshJobsJSON>(
  ({ projectID, documentID, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

    ...(projectID !== undefined && { projectID: projectID.toJSON() }),
    ...(documentID !== undefined && { documentID: documentID.toJSON() }),
  }),
  ({ projectID, documentID, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),
    ...(documentID !== undefined && { documentID: new ObjectId(documentID) }),
  })
);
