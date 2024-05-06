import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import {
  AmqpQueueMessagePriority,
  KBDocumentChunk,
  KBDocumentDocxData,
  KBDocumentPDFData,
  KBDocumentTableData,
  KBDocumentTextData,
  KBDocumentUrlData,
  KnowledgeBaseDocument,
  KnowledgeBaseDocumentRefreshRate,
  KnowledgeBaseDocumentStatus,
  KnowledgeBaseDocumentType,
} from '@voiceflow/dtos';
import { BadRequestException, ForbiddenException, NotAcceptableException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { KnowledgeBaseORM, ProjectORM, RefreshJobsOrm, VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import { FeatureFlag } from '@voiceflow/realtime-sdk/backend';
import { BillingAuthorizeItemName, BillingClient, BillingResourceType } from '@voiceflow/sdk-billing';
import { ObjectId } from 'bson';
import { z } from 'zod';

import { MutableService } from '@/common';
import { KlParserClient } from '@/common/clients/kl-parser/kl-parser.client';
import { FileService } from '@/file/file.service';
import { MulterFile, UploadType } from '@/file/types';

import { knowledgeBaseDocumentAdapter } from './document.adapter';
import { KBDocumentInsertChunkDTO } from './dtos/document-chunk.dto';
import { DocumentCreateManyURLsRequest } from './dtos/document-create.dto';
import { RefreshJobService } from './refresh-job.service';

@Injectable()
export class KnowledgeBaseDocumentService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  readonly MAX_CONCURRENT_DOCUMENTS = 300;

  readonly DOCUMENT_UPLOAD_TIMEOUT = 1000 * 60 * 5; // 5 minutes

  readonly KB_DOC_FINISH_STATUSES = new Set([KnowledgeBaseDocumentStatus.SUCCESS.toString(), KnowledgeBaseDocumentStatus.ERROR.toString()]);

  readonly DOCUMENT_TIMEOUT_STATUS = {
    type: KnowledgeBaseDocumentStatus.ERROR,
    data: 'Document upload timed out',
  };

  // eslint-disable-next-line max-params
  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(ProjectORM)
    protected readonly projectOrm: ProjectORM,
    @Inject(RefreshJobsOrm)
    protected readonly refreshJobsOrm: RefreshJobsOrm,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(RefreshJobService)
    private readonly refreshJobService: RefreshJobService,
    @Inject(BillingClient) private readonly billingClient: BillingClient,
    @Inject(KlParserClient)
    private klParserClient: KlParserClient,
    @Inject(FileService)
    private readonly file: FileService
  ) {
    super();
  }

  getDocumentCollisionMap(documents: VersionKnowledgeBaseDocument[]) {
    return Object.fromEntries(
      documents.map((document) => {
        let key: string | undefined;

        if (document.data?.type === KnowledgeBaseDocumentType.URL) {
          key = document.data.url;
        } else if (document.data?.type === KnowledgeBaseDocumentType.TABLE) {
          key = document.data.name;
        } else {
          key = document.s3ObjectRef;
        }

        return [key, document.documentID];
      })
    );
  }

  getFileTypeByMimetype(mimetype: string, originalName: string): KnowledgeBaseDocumentType {
    if (mimetype === 'application/pdf') {
      return KnowledgeBaseDocumentType.PDF;
    }
    if (mimetype === 'text/plain') {
      return KnowledgeBaseDocumentType.TEXT;
    }
    if (originalName.endsWith('.docx') || originalName.endsWith('.doc')) {
      return KnowledgeBaseDocumentType.DOCX;
    }

    throw new BadRequestException('invalid document type');
  }

  getKnowledgeBaseS3Key(projectID: string, originalName: string): string {
    return `${projectID}/${originalName}`;
  }

  async checkDocsPlanLimit(workspaceID: number, projectID: string, existingDocsCount: number, newDocsCount: number) {
    const message = 'maximum number of documents reached';

    if (this.unleash.isEnabled(FeatureFlag.UNLIMITED_KB_DOCS_FF, { workspaceID })) {
      return;
    }

    try {
      const response = await this.billingClient.authorizationPrivate.authorize({
        resourceID: projectID,
        resourceType: BillingResourceType.PROJECT,
        item: BillingAuthorizeItemName.KnowledgeBaseSources,
        value: newDocsCount,
        currentValue: existingDocsCount,
      });

      if (!response[BillingAuthorizeItemName.KnowledgeBaseSources]) {
        throw new ForbiddenException(message);
      }
    } catch (ForbiddenException) {
      throw new NotAcceptableException(message);
    }
  }

  async syncDocuments(projectID: string, documents: VersionKnowledgeBaseDocument[]): Promise<VersionKnowledgeBaseDocument[]> {
    const now = Date.now();
    const documentIDs: string[] = [];

    const updatedDocuments = documents.map((document) => {
      const updatedAt = document.updatedAt?.getTime?.();

      if (updatedAt && !this.KB_DOC_FINISH_STATUSES.has(document.status.type) && now - updatedAt > this.DOCUMENT_UPLOAD_TIMEOUT) {
        documentIDs.push(document.documentID);

        return { ...document, status: this.DOCUMENT_TIMEOUT_STATUS };
      }

      return document;
    });

    await this.orm.patchManyDocuments(projectID, documentIDs, {
      status: this.DOCUMENT_TIMEOUT_STATUS,
      updatedAt: new Date(),
    });

    return updatedDocuments;
  }

  async syncRefreshJobs(
    projectID: string,
    teamID: number,
    documents: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date })[]
  ) {
    const deleteDocumentIDs: string[] = [];

    // Update documents refresh jobs if refreshRate and they are not `never`
    const filteredDocs = documents.filter((doc) => {
      if (doc.data?.type !== KnowledgeBaseDocumentType.URL) {
        return false;
      }
      const urlData = doc.data as KBDocumentUrlData;

      if (urlData?.source && !urlData?.accessTokenID) {
        return false;
      }

      const refreshRate = urlData?.refreshRate;

      if (refreshRate === KnowledgeBaseDocumentRefreshRate.NEVER) {
        deleteDocumentIDs.push(doc.documentID);
        return false;
      }

      return refreshRate !== undefined;
    });

    const refreshJobsToUpdate = filteredDocs.map((doc) => {
      const { documentID, data, tags } = doc;
      const urlData = data as KBDocumentUrlData;

      return {
        projectID,
        refreshRate: urlData?.refreshRate,
        documentID,
        workspaceID: teamID,
        url: urlData?.url,
        name: urlData.name,
        tags: tags ?? [],
        integrationOauthTokenID: urlData?.accessTokenID,
        integrationExternalID: urlData?.integrationExternalID,
      };
    });

    await this.refreshJobService.updateMany(refreshJobsToUpdate);

    // Remove documents with refreshRate set to 'never' from refreshJobs collection
    await this.refreshJobsOrm.deleteManyByDocumentIDs(projectID, deleteDocumentIDs);
  }

  /* Create */

  async createManyDocuments(projectID: string, userID: number, data: DocumentCreateManyURLsRequest): Promise<KnowledgeBaseDocument[]> {
    const project = await this.projectOrm.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    const documentsToUpsert: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date })[] = [];
    let newDocsCount = 0;

    data.data.forEach((item) => {
      if (!collisionMap[item.url]) {
        newDocsCount += 1;
      }

      documentsToUpsert.push({
        status: { type: KnowledgeBaseDocumentStatus.PENDING },
        data: item,
        updatedAt: new Date(),
        creatorID: userID,
        documentID: collisionMap[item.url] ?? new ObjectId().toHexString(),
        tags: [],
      });
    });

    await this.checkDocsPlanLimit(project.teamID, projectID, existingDocuments.length, newDocsCount);

    await this.orm.upsertManyDocuments(projectID, documentsToUpsert);

    await this.refreshJobService.sendRefreshJobs(projectID, documentsToUpsert, project.teamID);

    // could be in background, no need to wait on ui
    this.syncRefreshJobs(projectID, project.teamID, documentsToUpsert);

    return documentsToUpsert.map((document: VersionKnowledgeBaseDocument) => knowledgeBaseDocumentAdapter.fromDB(document));
  }

  async uploadFileDocument(projectID: string, userID: number, file: MulterFile, canEdit?: boolean): Promise<KnowledgeBaseDocument> {
    const project = await this.projectOrm.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    const type: KnowledgeBaseDocumentType = this.getFileTypeByMimetype(file.mimetype, file.originalname);
    const s3ObjectRef: string = this.getKnowledgeBaseS3Key(projectID, file.originalname);

    const data = {
      type,
      name: s3ObjectRef.split('/').pop()?.toString(),
    } as KBDocumentTextData;

    if (data.type === KnowledgeBaseDocumentType.TEXT) {
      data.canEdit = canEdit ?? false;
    }

    const document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date } = {
      status: { type: KnowledgeBaseDocumentStatus.PENDING },
      data,
      updatedAt: new Date(),
      creatorID: userID,
      documentID: collisionMap[s3ObjectRef] ?? new ObjectId().toHexString(),
      tags: [],
      s3ObjectRef,
    };

    if (!collisionMap[s3ObjectRef]) {
      await this.checkDocsPlanLimit(project.teamID, projectID, existingDocuments.length, 1);
    }

    await this.file.uploadFile(UploadType.KB_DOCUMENT, s3ObjectRef, file.buffer);

    await this.orm.upsertManyDocuments(projectID, [document]);

    this.klParserClient.parse(projectID, document, project.teamID.toString(), {
      chunkStrategy: { type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER },
    });

    return knowledgeBaseDocumentAdapter.fromDB(document);
  }

  /* Find */

  async findOneDocument(assistantID: string, documentID: string) {
    const [document, chunks] = await Promise.all([
      this.orm.findOneDocument(assistantID, documentID),
      this.findDocumentChunks(assistantID, documentID),
    ]);

    return document ? { ...knowledgeBaseDocumentAdapter.fromDB(document), chunks } : undefined;
  }

  async findManyDocuments(assistantID: string, documentIDs?: string[]): Promise<KnowledgeBaseDocument[]> {
    const documents = documentIDs ? await this.orm.findManyDocuments(assistantID, documentIDs) : await this.orm.findAllDocuments(assistantID);

    // mark with an ERROR status documents that have not completed processing within 5 minutes
    await this.syncDocuments(assistantID, documents);

    return documents.map((document: VersionKnowledgeBaseDocument) => knowledgeBaseDocumentAdapter.fromDB(document));
  }

  async findDocumentChunks(assistantID: string, documentID: string): Promise<KBDocumentChunk[]> {
    const file = await this.file.downloadFile(UploadType.KB_DOCUMENT, `${assistantID}/embeddings/${documentID}.json`);

    const rawChunks = file ? z.array(KBDocumentInsertChunkDTO).parse(JSON.parse(await file.transformToString())) : [];

    return rawChunks
      ? rawChunks.map(({ id, metadata }) => ({
          chunkID: id,
          content: metadata.content,
        }))
      : [];
  }

  /* Patch */

  async patchOneDocument(
    assistantID: string,
    documentID: string,
    document: Omit<Partial<KnowledgeBaseDocument>, 'documentID' | 'status' | 'updatedAt'>
  ) {
    const project = await this.projectOrm.findOneOrFail(assistantID);

    const doc = await this.findOneDocument(assistantID, documentID);
    if (doc?.data?.type === KnowledgeBaseDocumentType.URL) {
      const urlData = doc?.data as KBDocumentUrlData;

      // check that integration doc type and integration did not remove
      if (urlData?.source && !urlData?.accessTokenID) {
        return;
      }

      this.syncRefreshJobs(assistantID, project.teamID, [
        {
          status: doc.status,
          data: { ...urlData, ...document.data, type: KnowledgeBaseDocumentType.URL },
          creatorID: doc.creatorID,
          documentID,
          updatedAt: new Date(),
        },
      ]);
    }

    await this.orm.patchOneDocument(assistantID, documentID, document);
  }

  async patchManyDocuments(
    assistantID: string,
    documentIDs: string[],
    patch: Omit<Partial<KnowledgeBaseDocument>, 'documentID' | 'status' | 'updatedAt' | 'data'> & {
      data:
        | Partial<KBDocumentUrlData>
        | Partial<KBDocumentDocxData>
        | Partial<KBDocumentPDFData>
        | Partial<KBDocumentTableData>
        | Partial<KBDocumentTextData>;
    }
  ) {
    const project = await this.projectOrm.findOneOrFail(assistantID);
    const documents = await this.findManyDocuments(assistantID, documentIDs);
    const refreshRatesDocuments: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date })[] = [];

    const validDocumentIDs = documentIDs.filter(async (documentID) => {
      const document = documents.find((doc) => doc.documentID === documentID);

      if (document?.data?.type === KnowledgeBaseDocumentType.URL) {
        const urlData = document?.data as KBDocumentUrlData;

        // check that integration doc type and integration did not remove
        if (urlData?.source && !urlData?.accessTokenID) {
          return null;
        }

        refreshRatesDocuments.push({
          status: document.status,
          data: { ...urlData, ...patch.data, type: KnowledgeBaseDocumentType.URL },
          creatorID: document.creatorID,
          documentID,
          updatedAt: new Date(),
        });
      }

      return documentID;
    });

    await this.orm.patchManyDocuments(assistantID, validDocumentIDs, patch);

    this.syncRefreshJobs(assistantID, project.teamID, refreshRatesDocuments);
  }

  /* Delete */

  async deleteManyDocuments(ids: string[], assistantID: string) {
    const workspaceID = await this.orm.getWorkspaceID(assistantID);
    await this.klParserClient.deleteMany(assistantID, ids, workspaceID.toString());

    await this.refreshJobsOrm.deleteManyByDocumentIDs(assistantID, ids);

    await this.orm.deleteManyDocuments(assistantID, ids);
  }

  /* Refresh & retry */

  async refreshManyDocuments(ids: string[], assistantID: string) {
    // todo: remove after migration to postgres
    if (ids.length > this.MAX_CONCURRENT_DOCUMENTS) {
      throw new BadRequestException('too many documents');
    }

    const project = await this.projectOrm.findOneOrFail(assistantID);
    const documents = project?.knowledgeBase?.documents ? Object.values(project.knowledgeBase.documents) : [];

    const filteredDocs = documents.filter(({ documentID, data, status }) => {
      if (
        !documentID ||
        !ids.includes(documentID) ||
        data?.type !== KnowledgeBaseDocumentType.URL ||
        // there is no point in updating an unfinished document in progress

        !this.KB_DOC_FINISH_STATUSES.has(status.type.toString())
      ) {
        return false;
      }
      const urlData = data as KBDocumentUrlData;

      // check that integration doc type and integration did not remove
      return !(urlData?.source && !urlData?.accessTokenID);
    });

    const documentIDs = filteredDocs.map(({ documentID }) => documentID);

    await this.orm.patchManyDocuments(assistantID, documentIDs, {
      status: {
        type: KnowledgeBaseDocumentStatus.PENDING,
      },
      updatedAt: new Date(),
    });

    // could be quite huge amount, medium priority, less then usual creation docs though ui, but higher than backgound refresh
    await this.refreshJobService.sendRefreshJobs(assistantID, filteredDocs, project.teamID, AmqpQueueMessagePriority.MEDIUM);
  }

  async retryOneDocument(assistantID: string, documentID: string): Promise<KnowledgeBaseDocument> {
    const workspaceID = await this.orm.getWorkspaceID(assistantID);
    const document = await this.orm.findOneDocument(assistantID, documentID);

    if (!document) {
      throw new BadRequestException('document not found');
    }

    const { data } = document;

    const dataForUpdate = {
      status: {
        type: KnowledgeBaseDocumentStatus.PENDING,
      },
      updatedAt: new Date(),
    };

    const updatedDocument = {
      ...document,
      ...dataForUpdate,
    };

    if (data?.type === KnowledgeBaseDocumentType.URL) {
      const urlData = data as KBDocumentUrlData;

      if ((urlData.source && !urlData.accessTokenID) || !data) {
        return knowledgeBaseDocumentAdapter.fromDB(document);
      }
      await this.orm.patchManyDocuments(assistantID, [documentID], dataForUpdate);
      await this.refreshJobService.sendRefreshJobs(assistantID, [document], workspaceID);
    } else {
      await this.orm.patchManyDocuments(assistantID, [documentID], dataForUpdate);

      this.klParserClient.parse(assistantID, updatedDocument, workspaceID.toString(), {
        chunkStrategy: { type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER },
      });
    }

    return knowledgeBaseDocumentAdapter.fromDB(updatedDocument);
  }
}
