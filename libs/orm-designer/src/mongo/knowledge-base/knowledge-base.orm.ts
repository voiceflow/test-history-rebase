import type { VersionKnowledgeBaseTag } from '@voiceflow/dtos';

import type { PullOperation, SetOperation } from '@/mongo/common/atomic';
import { ProjectORM } from '@/mongo/project';
import type { VersionKnowledgeBaseDocument } from '@/mongo/version';

import { Atomic } from '../common';

export class KnowledgeBaseORM extends ProjectORM {
  static KNOWLEDGE_BASE_DATA_PATH = 'knowledgeBase' as const;

  async getWorkspaceID(projectID: string) {
    const { teamID } = await this.findOneOrFail(projectID, { fields: ['teamID'] });
    return teamID;
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

  async patchOneDocument(projectID: string, documentID: string, data: Partial<VersionKnowledgeBaseDocument>) {
    await this.atomicUpdateOne(
      projectID,
      Object.entries(data).map(([key, value]) =>
        Atomic.Set([{ path: [KnowledgeBaseORM.KNOWLEDGE_BASE_DATA_PATH, 'documents', documentID, key], value }])
      )
    );
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
}
