import type {
  KBDocumentDocxData,
  KBDocumentPDFData,
  KBDocumentTableData,
  KBDocumentTextData,
  KBDocumentUrlData,
  KnowledgeBaseDocument,
  KnowledgeBaseDocumentRefreshRate,
  KnowledgeBaseSettings,
  VersionKnowledgeBaseTag,
} from '@voiceflow/dtos';

import type { PullOperation, SetOperation } from '@/mongo/common/atomic';
import { ProjectORM } from '@/mongo/project';
import type { VersionKnowledgeBaseDocument, VersionKnowledgeBasePatchDocument } from '@/mongo/version';

import { Atomic } from '../common';

export class KnowledgeBaseORM extends ProjectORM {
  static KNOWLEDGE_BASE_DATA_PATH = 'knowledgeBase' as const;

  static KNOWLEDGE_BASE_SETTINGS_PATH = 'settings' as const;

  async findSettings(projectID: string): Promise<KnowledgeBaseSettings | undefined> {
    const document = await this.findOne(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return document?.knowledgeBase?.settings;
  }

  async updateSettings(projectID: string, newSettings: KnowledgeBaseSettings): Promise<void> {
    await this.atomicUpdateOne(projectID, [
      Atomic.Set(
        Object.entries(newSettings)
          .filter(([, value]) => !!value)
          .map(([key, value]) => ({
            path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, KnowledgeBaseORM.KNOWLEDGE_BASE_SETTINGS_PATH, key],
            value,
          }))
      ),
    ]);
  }

  async findOneTag(projectID: string, tagID: string): Promise<VersionKnowledgeBaseTag | undefined> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return project?.knowledgeBase?.tags?.[tagID];
  }

  async findOneDocument(projectID: string, documentID: string): Promise<VersionKnowledgeBaseDocument | undefined> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });
    return project?.knowledgeBase?.documents?.[documentID];
  }

  async findManyDocuments(projectID: string, documentIDs: string[]): Promise<VersionKnowledgeBaseDocument[]> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents).filter(
          ({ documentID }) => !!documentID && documentIDs.includes(documentID)
        )
      : [];
  }

  async findAllDocuments(projectID: string): Promise<VersionKnowledgeBaseDocument[]> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents).filter(({ documentID }) => !!documentID)
      : [];
  }

  async findAllTags(projectID: string): Promise<VersionKnowledgeBaseTag[]> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return project?.knowledgeBase?.tags ? Object.values(project.knowledgeBase.tags) : [];
  }

  async findAllTagsRecords(projectID: string): Promise<Record<string, VersionKnowledgeBaseTag>> {
    const project = await this.findOneOrFail(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });

    return project?.knowledgeBase?.tags ?? {};
  }

  async patchOneDocument(projectID: string, documentID: string, data: Partial<VersionKnowledgeBasePatchDocument>) {
    await this.atomicUpdateOne(projectID, [
      Atomic.Set(
        Object.entries(data)
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return Object.entries(value).map(([nestedKey, nestedValue]) => ({
                path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, key, nestedKey],
                value: nestedValue,
              }));
            }
            return {
              path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, key],
              value,
            };
          })
          .flat()
      ),
    ]);
  }

  async patchManyDocuments(
    projectID: string,
    documentIDs: string[],
    data: Omit<Partial<KnowledgeBaseDocument>, 'documentID' | 'updatedAt' | 'data'> & {
      data?:
        | Partial<KBDocumentUrlData>
        | Partial<KBDocumentDocxData>
        | Partial<KBDocumentPDFData>
        | Partial<KBDocumentTableData>
        | Partial<KBDocumentTextData>;
      updatedAt?: Date;
    }
  ) {
    const updateData: SetOperation[] = documentIDs.flatMap((documentID) =>
      Object.entries(data).flatMap(([key, value]) => {
        if (key === 'data') {
          return Object.entries(data.data ?? {}).map(
            ([key, value]) =>
              ({
                path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, 'data', key],
                value,
              }) as SetOperation
          );
        }
        return {
          path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, key],
          value,
        } as SetOperation;
      })
    );

    await this.atomicUpdateOne(projectID, [Atomic.Set(updateData)]);
  }

  async upsertOneDocument(
    projectID: string,
    document: Omit<VersionKnowledgeBaseDocument, 'documentID'> & { documentID: string }
  ) {
    await this.atomicUpdateOne(projectID, [
      Atomic.Set([
        { path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', document.documentID], value: document },
      ]),
    ]);
  }

  async upsertOneTag(projectID: string, tag: VersionKnowledgeBaseTag) {
    await this.atomicUpdateOne(projectID, [
      Atomic.Set([{ path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'tags', tag.tagID], value: tag }]),
    ]);
  }

  async upsertManyDocuments(
    projectID: string,
    documents: (Omit<VersionKnowledgeBaseDocument, 'documentID'> & { documentID: string })[]
  ) {
    const updateData: SetOperation[] = documents.map((document) => ({
      path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', document.documentID],
      value: document,
    }));

    await this.atomicUpdateOne(projectID, [Atomic.Set(updateData)]);
  }

  async upsertManyTags(projectID: string, tags: VersionKnowledgeBaseTag[]) {
    const updateData: SetOperation[] = tags.map((tag) => ({
      path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'tags', tag.tagID],
      value: tag,
    }));

    await this.atomicUpdateOne(projectID, [Atomic.Set(updateData)]);
  }

  async deleteOneDocument(projectID: string, documentID: string) {
    await this.atomicUpdateOne(projectID, [
      Atomic.Unset([{ path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID] }]),
    ]);
  }

  async deleteOneTag(projectID: string, tagID: string) {
    const project = await this.findOne(projectID, { fields: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH] });
    const removeDocsTagOperations: PullOperation[] = [];

    Object.entries(project?.knowledgeBase?.documents ?? {}).forEach(([documentID, document]) => {
      if (document?.tags?.includes(tagID)) {
        removeDocsTagOperations.push({
          path: `${KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH}.documents.${[documentID]}.tags`,
          match: tagID,
        });
      }
    });

    await this.atomicUpdateOne(projectID, [
      Atomic.Unset([{ path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'tags', tagID] }]),
      // detach tagID from all related KBDocuments
      Atomic.Pull(removeDocsTagOperations),
    ]);
  }

  async deleteManyDocuments(projectID: string, documentIDs: string[]) {
    await this.atomicUpdateOne(
      projectID,
      documentIDs.map((documentID) =>
        Atomic.Unset([{ path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID] }])
      )
    );
  }

  async attachManyTagsToDocument(projectID: string, documentID: string, tagIDs: string[]) {
    await this.atomicUpdateOne(projectID, [
      Atomic.AddToSet([
        { path: `${KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH}.documents.${[documentID]}.tags`, value: tagIDs },
      ]),
    ]);
  }

  async detachManyTagsFromDocument(projectID: string, documentID: string, tagIDs: string[]) {
    await this.atomicUpdateOne(projectID, [
      Atomic.PullAll([
        { path: `${KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH}.documents.${[documentID]}.tags`, match: tagIDs },
      ]),
    ]);
  }

  async detachTagFromManyDocuments(projectID: string, tagID: string) {
    const documents = await this.findAllDocuments(projectID);

    const updateData: SetOperation[] = documents
      .filter(({ tags }) => tags && tags.includes(tagID))
      .map(
        ({ documentID, tags }) =>
          ({
            path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, tags],
            value: tags ? tags.filter((tag) => tag !== tagID) : [],
          }) as SetOperation
      );

    await this.atomicUpdateOne(projectID, [Atomic.Set(updateData)]);
  }

  async unsetDocumentsAccessToken(assistantID: string, documentIDs: string[]) {
    return this.atomicUpdateOne(assistantID, [
      Atomic.Unset(
        documentIDs.map((documentID) => ({
          path: `knowledgeBase.documents.${documentID}.data.accessTokenID`,
        }))
      ),
    ]);
  }

  async updateDocumentsRefreshRate(
    assistantID: string,
    documentIDs: string[],
    refreshRate: KnowledgeBaseDocumentRefreshRate
  ) {
    return this.findOneAndAtomicUpdate(assistantID, [
      Atomic.Set(
        documentIDs.map((documentID) => ({
          path: `knowledgeBase.documents.${documentID}.data.refreshRate`,
          value: refreshRate,
        }))
      ),
    ]);
  }

  async updateIntegrationDocuments(assistantID: string, documents: VersionKnowledgeBaseDocument[]) {
    const atomicOperations = documents.map((document) => {
      return {
        path: ['knowledgeBase', 'documents', document.documentID],
        value: document,
      };
    });

    await this.atomicUpdateOne(assistantID, [Atomic.Set(atomicOperations)]);
  }
}
