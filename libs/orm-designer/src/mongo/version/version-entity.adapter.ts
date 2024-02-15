import { ObjectId } from '@mikro-orm/mongodb';
import { Utils } from '@voiceflow/common';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoObjectEntityAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { VersionEntity } from './version.entity';

export const VersionEntityAdapter = createSmartMultiAdapter<EntityObject<VersionEntity>, ToJSON<VersionEntity>>(
  ({ domains, projectID, rootDiagramID, knowledgeBase, templateDiagramID, ...data }) => ({
    ...MongoObjectEntityAdapter.fromDB(data),

    ...(domains !== undefined && {
      domains: domains.map(({ updatedBy, updatedAt, updatedByCreatorID, ...domain }) => ({
        ...domain,
        updatedBy: updatedBy ?? updatedByCreatorID,
        updatedAt: updatedAt?.toJSON(),
      })),
    }),

    ...(projectID !== undefined && { projectID: projectID.toJSON() }),

    ...(rootDiagramID !== undefined && { rootDiagramID: rootDiagramID.toJSON() }),

    ...(templateDiagramID !== undefined && { templateDiagramID: templateDiagramID.toJSON() }),

    ...(knowledgeBase !== undefined && {
      knowledgeBase: {
        ...Utils.object.omit(knowledgeBase, ['faqSets', 'documents']),

        ...(knowledgeBase.faqSets !== undefined && {
          faqSets: Object.fromEntries(
            Object.entries(knowledgeBase.faqSets).map(([key, value]) => [
              key,
              { ...value, updatedAt: value.updatedAt?.toJSON() },
            ])
          ),
        }),

        ...(knowledgeBase.documents !== undefined && {
          documents: Object.fromEntries(
            Object.entries(knowledgeBase.documents).map(([key, value]) => [
              key,
              { ...value, updatedAt: value.updatedAt?.toJSON() },
            ])
          ),
        }),
      },
    }),
  }),
  ({ domains, projectID, rootDiagramID, knowledgeBase, templateDiagramID, ...data }) => ({
    ...MongoObjectEntityAdapter.toDB(data),

    ...(domains !== undefined && {
      domains: domains.map(({ updatedAt, updatedBy, updatedByCreatorID, ...data }) => ({
        ...data,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        ...((updatedBy ?? updatedByCreatorID) && { updatedBy: updatedBy ?? updatedByCreatorID }),
      })),
    }),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),

    ...(rootDiagramID !== undefined && { rootDiagramID: new ObjectId(rootDiagramID) }),

    ...(templateDiagramID !== undefined && { templateDiagramID: new ObjectId(templateDiagramID) }),

    ...(knowledgeBase !== undefined && {
      knowledgeBase: {
        ...Utils.object.omit(knowledgeBase, ['faqSets', 'documents']),

        ...(knowledgeBase.faqSets !== undefined && {
          faqSets: Object.fromEntries(
            Object.entries(knowledgeBase.faqSets).map(([key, { updatedAt, ...value }]) => [
              key,
              { ...value, updatedAt: updatedAt ? new Date(updatedAt) : new Date() },
            ])
          ),
        }),

        ...(knowledgeBase.documents !== undefined && {
          documents: Object.fromEntries(
            Object.entries(knowledgeBase.documents).map(([key, { updatedAt, ...value }]) => [
              key,
              { ...value, updatedAt: updatedAt ? new Date(updatedAt) : new Date() },
            ])
          ),
        }),
      },
    }),
  })
);
