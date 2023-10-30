import { ObjectId } from '@mikro-orm/mongodb';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { MongoJSONAdapter } from '@/mongo/common';
import type { EntityObject, ToJSON } from '@/types';

import type { VersionEntity } from './version.entity';

export const VersionJSONAdapter = createSmartMultiAdapter<EntityObject<VersionEntity>, ToJSON<VersionEntity>>(
  ({ domains, projectID, rootDiagramID, knowledgeBase, templateDiagramID, nluUnclassifiedData, ...data }) => ({
    ...MongoJSONAdapter.fromDB(data),

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

    ...(nluUnclassifiedData !== undefined && {
      nluUnclassifiedData: nluUnclassifiedData?.map((data) => ({
        ...data,
        importedAt: data.importedAt?.toJSON(),
        utterances: data.utterances?.map((utterance) => ({ ...utterance, importedAt: utterance.importedAt?.toJSON() })),
      })),
    }),

    ...(knowledgeBase !== undefined && {
      knowledgeBase: knowledgeBase && {
        ...knowledgeBase,
        faqSets:
          knowledgeBase.faqSets &&
          Object.fromEntries(
            Object.entries(knowledgeBase.faqSets).map(([key, value]) => [
              key,
              { ...value, updatedAt: value.updatedAt?.toJSON() },
            ])
          ),
        documents:
          knowledgeBase.documents &&
          Object.fromEntries(
            Object.entries(knowledgeBase.documents).map(([key, value]) => [
              key,
              { ...value, updatedAt: value.updatedAt?.toJSON() },
            ])
          ),
      },
    }),
  }),
  ({ domains, projectID, rootDiagramID, knowledgeBase, templateDiagramID, nluUnclassifiedData, ...data }) => ({
    ...MongoJSONAdapter.toDB(data),

    ...(domains !== undefined && {
      domains: domains.map(({ updatedAt, updatedBy, updatedByCreatorID, ...data }) => ({
        ...data,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        updatedBy: updatedBy ?? updatedByCreatorID,
      })),
    }),

    ...(projectID !== undefined && { projectID: new ObjectId(projectID) }),

    ...(rootDiagramID !== undefined && { rootDiagramID: new ObjectId(rootDiagramID) }),

    ...(templateDiagramID !== undefined && { templateDiagramID: new ObjectId(templateDiagramID) }),

    ...(nluUnclassifiedData !== undefined && {
      nluUnclassifiedData: nluUnclassifiedData.map(({ importedAt, utterances, ...data }) => ({
        ...data,
        importedAt: importedAt ? new Date(importedAt) : new Date(),
        utterances: utterances.map(({ importedAt: _, ...utterance }) => utterance),
      })),
    }),

    ...(knowledgeBase !== undefined && {
      knowledgeBase: {
        ...knowledgeBase,

        faqSets:
          knowledgeBase.faqSets &&
          Object.fromEntries(
            Object.entries(knowledgeBase.faqSets!).map(([key, { updatedAt, ...value }]) => [
              key,
              { ...value, updatedAt: updatedAt ? new Date(updatedAt) : new Date() },
            ])
          ),

        documents:
          knowledgeBase.documents &&
          Object.fromEntries(
            Object.entries(knowledgeBase.documents).map(([key, { updatedAt, ...value }]) => [
              key,
              { ...value, updatedAt: updatedAt ? new Date(updatedAt) : new Date() },
            ])
          ),
      },
    }),
  })
);
