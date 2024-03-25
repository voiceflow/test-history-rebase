import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoObjectJSONAdapter } from '@/mongo/common';

import { VersionJSONAdapter } from '../version/version-json.adapter';
import type { ProjectJSON, ProjectObject } from './project.interface';

export const ProjectJSONAdapter = createSmartMultiAdapter<ProjectObject, ProjectJSON>(
  ({ createdAt, devVersion, liveVersion, previewVersion, knowledgeBase, ...data }) => ({
    ...MongoObjectJSONAdapter.fromDB(data),
    ...VersionJSONAdapter.fromDB({ knowledgeBase }),

    ...(createdAt !== undefined && { createdAt: createdAt?.toJSON() ?? null }),

    ...(devVersion !== undefined && { devVersion: devVersion.toJSON() }),

    ...(previewVersion !== undefined && { previewVersion: previewVersion.toJSON() }),

    ...(liveVersion !== undefined && { liveVersion: liveVersion.toJSON() }),
  }),
  ({ createdAt, devVersion, liveVersion, previewVersion, knowledgeBase, ...data }) => ({
    ...MongoObjectJSONAdapter.toDB(data),
    ...VersionJSONAdapter.toDB({ knowledgeBase }),

    ...(createdAt !== undefined && { createdAt: createdAt ? new Date(createdAt) : null }),

    ...(devVersion !== undefined && { devVersion: new ObjectId(devVersion) }),

    ...(liveVersion !== undefined && { liveVersion: new ObjectId(liveVersion) }),

    ...(previewVersion !== undefined && { previewVersion: new ObjectId(previewVersion) }),
  })
);
