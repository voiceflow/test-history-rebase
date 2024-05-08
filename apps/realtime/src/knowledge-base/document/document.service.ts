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
  KBTagsFilter,
  KnowledgeBaseDocument,
  KnowledgeBaseDocumentRefreshRate,
  KnowledgeBaseDocumentStatus,
  KnowledgeBaseDocumentType,
} from '@voiceflow/dtos';
import { BadRequestException, ConflictException, ForbiddenException, NotAcceptableException, NotFoundException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { KnowledgeBaseORM, ProjectORM, RefreshJobsOrm, VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import { FeatureFlag } from '@voiceflow/realtime-sdk/backend';
import { Identity } from '@voiceflow/sdk-auth';
import { AuthService } from '@voiceflow/sdk-auth/nestjs';
import { BillingAuthorizeItemName, BillingClient, BillingResourceType } from '@voiceflow/sdk-billing';
import { ObjectId } from 'bson';
import type { Request } from 'express';
import Sitemapper from 'sitemapper';
import { z } from 'zod';

import { MutableService } from '@/common';
import { KlParserClient } from '@/common/clients/kl-parser/kl-parser.client';
import { FileService } from '@/file/file.service';
import { MulterFile, UploadType } from '@/file/types';

import { KnowledgeBaseTagService } from '../tag/tag.service';
import { knowledgeBaseDocumentAdapter } from './document.adapter';
import { KBDocumentInsertChunkDTO } from './dtos/document-chunk.dto';
import { DocumentCreateManyURLsRequest, DocumentCreateOnePublicRequestParams, DocumentCreateOneURLRequest } from './dtos/document-create.dto';
import { DocumentFindManyPublicQuery } from './dtos/document-find.dto';
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
    @Inject(KnowledgeBaseTagService)
    private readonly tagService: KnowledgeBaseTagService,
    @Inject(AuthService)
    private readonly authService: AuthService,

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

  async createOneUrlDocument({
    projectID,
    userID,
    data,
    existingDocumentID,
    query = {},
  }: {
    projectID: string;
    userID: number;
    data: DocumentCreateOneURLRequest;
    existingDocumentID?: string;
    query?: Omit<DocumentCreateOnePublicRequestParams, 'overwrite'> & { overwrite?: boolean };
  }): Promise<KnowledgeBaseDocument> {
    const { overwrite = false, maxChunkSize = undefined, tags = undefined } = query;
    const tagsArray = this.tagService.convertToArray(tags);

    if (existingDocumentID) await this.validateDocumentExists(projectID, existingDocumentID);

    const project = await this.projectOrm.findOneOrFail(projectID);
    const urlData = data.data as KBDocumentUrlData;
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    if (collisionMap[urlData.url] && !overwrite) {
      throw new ConflictException('file already exists');
    }

    let tagObjects = new Set<string>();

    if (tagsArray) {
      // with force creation to true
      await this.tagService.checkKBTagLabelsExists({
        assistantID: projectID,
        tagLabels: tagsArray,
        createIfMissingTags: true,
      });
      tagObjects = await this.tagService.tagNamesToObjectIds(projectID, tagsArray);
    }

    // if tags don't provided and document exists, keep existing tags with doc
    if (existingDocumentID && tagObjects.size === 0) {
      const existingDocument = await this.orm.findOneDocument(projectID, existingDocumentID);
      (existingDocument?.tags ?? []).forEach((tag) => tagObjects.add(tag));
    }

    const document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & { documentID: string; updatedAt: Date } = {
      status: { type: KnowledgeBaseDocumentStatus.PENDING },
      data: urlData,
      updatedAt: new Date(),
      creatorID: userID,
      documentID: collisionMap[urlData.url] ?? existingDocumentID ?? new ObjectId().toHexString(),
      tags: Array.from(tagObjects),
    };

    if (!collisionMap[urlData.url] && !existingDocumentID) {
      await this.checkDocsPlanLimit(project.teamID, projectID, existingDocuments.length, 1);
    }

    await this.orm.upsertManyDocuments(projectID, [document]);

    // could be in background, no need to wait on ui
    this.syncRefreshJobs(projectID, project.teamID, [document]);

    this.klParserClient.parse(projectID, document, project.teamID.toString(), {
      chunkStrategy: { type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER, size: maxChunkSize },
    });

    return knowledgeBaseDocumentAdapter.fromDB(document);
  }

  async replaceFileDocument(projectID: string, userID: number, documentID: string, file: MulterFile, canEdit = true): Promise<KnowledgeBaseDocument> {
    return this.uploadFileDocument({ projectID, userID, file, canEdit, existingDocumentID: documentID, query: { overwrite: true } });
  }

  async uploadFileDocument({
    projectID,
    userID,
    file,
    canEdit,
    existingDocumentID,
    query = {},
  }: {
    projectID: string;
    userID: number;
    file: MulterFile;
    canEdit?: boolean;
    existingDocumentID?: string;
    query?: Omit<DocumentCreateOnePublicRequestParams, 'overwrite'> & { overwrite?: boolean };
  }): Promise<KnowledgeBaseDocument> {
    const { overwrite = false, maxChunkSize = undefined, tags = undefined } = query;
    const tagsArray = this.tagService.convertToArray(tags);

    if (existingDocumentID) await this.validateDocumentExists(projectID, existingDocumentID);

    const project = await this.projectOrm.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    const type: KnowledgeBaseDocumentType = this.getFileTypeByMimetype(file.mimetype, file.originalname);
    const s3ObjectRef: string = this.getKnowledgeBaseS3Key(projectID, file.originalname);
    if (collisionMap[s3ObjectRef] && !overwrite) {
      throw new ConflictException('file already exists');
    }

    let tagObjects = new Set<string>();

    if (tagsArray) {
      // with force creation to true
      await this.tagService.checkKBTagLabelsExists({
        assistantID: projectID,
        tagLabels: tagsArray,
        createIfMissingTags: true,
      });
      tagObjects = await this.tagService.tagNamesToObjectIds(projectID, tagsArray);
    }

    // if tags don't provided and document exists, keep existing tags with doc
    if (existingDocumentID && tagObjects.size === 0) {
      const existingDocument = await this.orm.findOneDocument(projectID, existingDocumentID);
      (existingDocument?.tags ?? []).forEach((tag) => tagObjects.add(tag));
    }

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
      documentID: collisionMap[s3ObjectRef] ?? existingDocumentID ?? new ObjectId().toHexString(),
      tags: Array.from(tagObjects),
      s3ObjectRef,
    };

    if (!collisionMap[s3ObjectRef] && !existingDocumentID) {
      await this.checkDocsPlanLimit(project.teamID, projectID, existingDocuments.length, 1);
    }

    await this.file.uploadFile(UploadType.KB_DOCUMENT, s3ObjectRef, file.buffer);

    await this.orm.upsertManyDocuments(projectID, [document]);

    this.klParserClient.parse(projectID, document, project.teamID.toString(), {
      chunkStrategy: { type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER, size: maxChunkSize },
    });

    return knowledgeBaseDocumentAdapter.fromDB(document);
  }

  /* Find */

  async findOneDocument(assistantID: string, documentID: string) {
    try {
      const [document, chunks] = await Promise.all([
        this.orm.findOneDocument(assistantID, documentID),
        this.findDocumentChunks(assistantID, documentID),
      ]);

      return document ? { ...knowledgeBaseDocumentAdapter.fromDB(document), chunks } : undefined;
    } catch (error) {
      throw new NotFoundException("Document doesn't exist");
    }
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

  async findManyDocumentsByFilters(assistantID: string, query: DocumentFindManyPublicQuery = {}) {
    const {
      page = 1,
      limit: l = 10,
      documentType,
      includeTags = [],
      excludeTags = [],
      includeAllTagged = false,
      includeAllNonTagged = false,
    } = query;

    const limit = Math.max(Math.min(l, 100), 1);

    const includeTagsArray = this.tagService.convertToArray(includeTags);
    const excludeTagsArray = this.tagService.convertToArray(excludeTags);
    const existingTags = await this.tagService.getTagsRecords(assistantID);

    if (includeTagsArray.length > 0 || excludeTagsArray.length > 0) {
      await this.tagService.checkKBTagLabelsExists({
        assistantID,
        tagLabels: Array.from(new Set([...includeTagsArray, ...excludeTagsArray])),
        existingTags,
      });
    }

    const includeTagIDs = await this.tagService.tagNamesToObjectIds(assistantID, includeTagsArray, existingTags);
    const excludeTagIDs = await this.tagService.tagNamesToObjectIds(assistantID, excludeTagsArray, existingTags);

    const tagsFilter: KBTagsFilter = {
      include: {
        items: Array.from(includeTagIDs),
      },
      exclude: {
        items: Array.from(excludeTagIDs),
      },
      includeAllTagged,
      includeAllNonTagged,
    };

    const { total, documents } = await this.list(assistantID, { documentType, page, limit, tagsFilter });

    const documentsWithTagLabels = await Promise.all(
      documents.map(async (document) => ({
        ...document,
        tags: Array.from(
          await this.tagService.tagObjectIdsToNames({
            assistantID,
            tagIDs: document?.tags ?? [],
            existingTags,
          })
        ),
      }))
    );

    return {
      total,
      data: documentsWithTagLabels.map((document) => ({
        data: document.data,
        tags: document.tags,
        documentID: document.documentID,
        updatedAt: document.updatedAt?.toISOString() || '',
        status: document.status,
      })),
    };
  }

  async validateDocumentExists(assistantID: string, documentID: string) {
    const document = await this.orm.findOneDocument(assistantID, documentID);
    if (!document) throw new NotFoundException("Document doesn't exist");

    return document;
  }

  async list(
    projectID: string,
    {
      documentType,
      page,
      limit,
      tagsFilter,
    }: {
      page: number;
      limit: number;
      tagsFilter?: KBTagsFilter;
      documentType?: KnowledgeBaseDocumentType;
    }
  ) {
    let documents = await this.orm.findAllDocuments(projectID);

    if (documentType) {
      documents = documents.filter((document) => document.data?.type === documentType);
    }

    // at least one of the filters is not empty
    if (
      tagsFilter &&
      ((tagsFilter?.include?.items ?? []).length > 0 ||
        (tagsFilter?.exclude?.items ?? []).length > 0 ||
        tagsFilter?.includeAllTagged ||
        tagsFilter?.includeAllNonTagged)
    ) {
      const { filteredDocuments } = await this.tagService.filterDocumentsByTags(tagsFilter, documents);

      documents = filteredDocuments;
    }

    const total = documents.length;
    documents = documents.slice((page - 1) * limit, page * limit);

    // mark with an ERROR status documents that have not completed processing within 5 minutes
    documents = await this.syncDocuments(projectID, documents);

    return {
      total,
      documents,
    };
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

  /* Download */

  async downloadDocument(assistantID: string, documentID: string) {
    const document = await this.findOneDocument(assistantID, documentID);

    if (!document || !document.s3ObjectRef) {
      throw new NotFoundException('document not found');
    }

    const file = await this.file.downloadFile(UploadType.KB_DOCUMENT, document.s3ObjectRef);

    if (!file) {
      throw new NotFoundException('file not found');
    }

    return file.transformToByteArray();
  }

  /* Sitemap */

  async sitemapUrlExraction(sitemapURL: string) {
    const { sites } = await new Sitemapper({ url: sitemapURL, timeout: 10000 }).fetch();
    return sites.map((site) => site.trim());
  }

  /* Tags */

  async attachTagsOneDocument(assistantID: string, documentID: string, tagLabels: string[]) {
    const document = await this.validateDocumentExists(assistantID, documentID);

    await this.tagService.checkKBTagLabelsExists({ assistantID, tagLabels });
    const tagsIds = Array.from(await this.tagService.tagNamesToObjectIds(assistantID, tagLabels));

    const tagsToAdd = tagsIds.filter((value) => !(document?.tags ?? []).includes(value));

    await this.tagService.limitKBTagsDocument(document, tagsToAdd.length);

    this.orm.attachManyTagsToDocument(assistantID, documentID, tagsToAdd);

    // TODO: update tags for KB refresh job, if object exists
    // await this.models.refreshJobs.attachTags({ projectID, documentID, tags: tagsToAdd });

    // TODO: update tags list in vector DB metadata (parser service)
    // this.updateKBParserTags(projectID, documentID, requestConfig);
  }

  async detachTagsOneDocument(assistantID: string, documentID: string, tagLabels: string[]) {
    const document = await this.validateDocumentExists(assistantID, documentID);

    await this.tagService.checkKBTagLabelsExists({ assistantID, tagLabels });
    const tagsIds = Array.from(await this.tagService.tagNamesToObjectIds(assistantID, tagLabels));

    const tagsToRemove = tagsIds.filter((value) => !(document?.tags ?? []).includes(value));

    this.orm.detachManyTagsFromDocument(assistantID, documentID, tagsToRemove);

    // TODO: delete tags for KB refresh job, if object exists
    // await this.models.refreshJobs.dettachTags({ projectID, documentID, tags: tagsIds });

    // TODO: update tags list in vector DB metadata (parser service)
    // this.updateKBParserTags(projectID, documentID, requestConfig);
  }

  /* Utils */

  public async resolveAssistantID(request: Request) {
    const apiKey = request.headers.authorization;

    if (!apiKey) {
      throw new ForbiddenException('API key is required');
    }

    const response = await this.authService.getIdentity(`ApiKey ${apiKey}`);

    if (!response) {
      throw new NotFoundException('Project not found');
    }

    const identity = response.identity as Identity & { legacy: { projectID: string } };

    return identity?.legacy?.projectID;
  }
}
