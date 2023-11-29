import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import { VersionJSONAdapter } from '../version/version.adapter';
import type { ProjectEntity } from './project.entity';

export const ProjectJSONAdapter = createSmartMultiAdapter<EntityObject<ProjectEntity>, ToJSON<ProjectEntity>>(
  ({ createdAt, updatedAt, devVersion, liveVersion, previewVersion, knowledgeBase, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),
    ...VersionJSONAdapter.fromDB({ knowledgeBase }),

    ...(createdAt !== undefined && { createdAt: createdAt?.toJSON() ?? null }),

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),

    ...(devVersion !== undefined && { devVersion: devVersion.toJSON() }),
    ...(previewVersion !== undefined && { previewVersion: previewVersion.toJSON() }),

    ...(liveVersion !== undefined && { liveVersion: liveVersion.toJSON() }),
  }),
  ({ createdAt, updatedAt, devVersion, liveVersion, previewVersion, knowledgeBase, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),
    ...VersionJSONAdapter.toDB({ knowledgeBase }),

    ...(createdAt !== undefined && { createdAt: createdAt ? new Date(createdAt) : null }),

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),

    ...(devVersion !== undefined && { devVersion: new ObjectId(devVersion) }),

    ...(liveVersion !== undefined && { liveVersion: new ObjectId(liveVersion) }),

    ...(previewVersion !== undefined && { previewVersion: new ObjectId(previewVersion) }),
  })
);
