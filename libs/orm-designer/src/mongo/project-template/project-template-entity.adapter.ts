import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoEntityAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { ProjectTemplateEntity } from './project-template.entity';

export const ProjectTemplateEntityAdapter = createSmartMultiAdapter<
  EntityObject<ProjectTemplateEntity>,
  ToJSON<ProjectTemplateEntity>
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
