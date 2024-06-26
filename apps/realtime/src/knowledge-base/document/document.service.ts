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
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
} from '@voiceflow/exception';
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

import { KnowledgeBaseSettingsService } from '../settings/settings.service';
import { KnowledgeBaseTagService } from '../tag/tag.service';
import { knowledgeBaseDocumentAdapter } from './document.adapter';
import { KBDocumentInsertChunkDTO } from './dtos/document-chunk.dto';
import {
  DocumentCreateManyURLsRequest,
  DocumentCreateOnePublicRequestParams,
  DocumentCreateOneURLRequest,
  DocumentUploadTableRequestData,
  DocumentUploadTableResponse,
} from './dtos/document-create.dto';
import { DocumentFindManyPublicQuery } from './dtos/document-find.dto';
import type { DocumentPatchOneRequest } from './dtos/document-patch.dto';
import { RefreshJobService } from './refresh-job.service';

@Injectable()
export class KnowledgeBaseDocumentService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  readonly MAX_CONCURRENT_DOCUMENTS = 300;

  readonly DOCUMENT_UPLOAD_TIMEOUT = 1000 * 60 * 5; // 5 minutes

  readonly KB_DOC_FINISH_STATUSES = new Set([
    KnowledgeBaseDocumentStatus.SUCCESS.toString(),
    KnowledgeBaseDocumentStatus.ERROR.toString(),
  ]);

  readonly DOCUMENT_TIMEOUT_STATUS = {
    type: KnowledgeBaseDocumentStatus.ERROR,
    data: 'Document upload timed out',
  };

  // eslint-disable-next-line max-params
  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(ProjectORM)
    protected readonly projectORM: ProjectORM,
    @Inject(RefreshJobsOrm)
    protected readonly refreshJobsORM: RefreshJobsOrm,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(RefreshJobService)
    private readonly refreshJobService: RefreshJobService,
    @Inject(BillingClient)
    private readonly billingClient: BillingClient,
    @Inject(KlParserClient)
    private klParserClient: KlParserClient,
    @Inject(KnowledgeBaseTagService)
    private readonly tagService: KnowledgeBaseTagService,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(KnowledgeBaseSettingsService)
    private readonly knowledgeBaseSettingsService: KnowledgeBaseSettingsService,

    @Inject(FileService)
    private readonly file: FileService
  ) {
    super();
  }

  strippedURL = (url: string) => {
    const { host, pathname, search } = new URL(url);
    return `${host.replace('www.', '')}${pathname}${search}`;
  };

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

  checkExistingDocConflict(overwrite: boolean, requestedDocumentID?: string, existingDocumentID?: string) {
    if (existingDocumentID && !overwrite) {
      throw new ConflictException('file already exists');
    }

    if (requestedDocumentID && existingDocumentID && requestedDocumentID !== existingDocumentID) {
      throw new ConflictException(`file already exists under documentID: ${existingDocumentID}`);
    }
  }

  async klParserProcessingCall({
    projectID,
    workspaceID,
    document,
    maxChunkSize,
  }: {
    projectID: string;
    workspaceID: number;
    document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    };
    maxChunkSize?: number;
  }) {
    const settings = await this.knowledgeBaseSettingsService.findForAssistant(projectID);

    await this.klParserClient.parse(projectID, document, workspaceID.toString(), {
      chunkStrategy: {
        type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER,
        size: maxChunkSize ?? settings.chunkStrategy.size,
        overlap: settings.chunkStrategy.overlap,
      },
      embeddingModel: settings.embeddingModel,
    });
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
    } catch (error) {
      throw new NotAcceptableException(message);
    }
  }

  async syncDocuments(
    projectID: string,
    documents: VersionKnowledgeBaseDocument[]
  ): Promise<VersionKnowledgeBaseDocument[]> {
    const now = Date.now();
    const documentIDs: string[] = [];

    const updatedDocuments = documents.map((document) => {
      const updatedAt = document.updatedAt?.getTime?.();

      if (
        updatedAt &&
        !this.KB_DOC_FINISH_STATUSES.has(document.status.type) &&
        now - updatedAt > this.DOCUMENT_UPLOAD_TIMEOUT
      ) {
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
    documents: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    })[]
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
    await this.refreshJobsORM.deleteManyByDocumentIDs(projectID, deleteDocumentIDs);
  }

  /* Create */

  async createManyDocuments(
    projectID: string,
    userID: number,
    data: DocumentCreateManyURLsRequest
  ): Promise<KnowledgeBaseDocument[]> {
    const project = await this.projectORM.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    const documentsToUpsert: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    })[] = [];
    let newDocsCount = 0;

    data.data.forEach((item) => {
      if (!collisionMap[item.url]) {
        newDocsCount += 1;
      }

      documentsToUpsert.push({
        status: { type: KnowledgeBaseDocumentStatus.PENDING },
        data: { ...item, name: this.strippedURL(item.url) },
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

    return documentsToUpsert.map((document: VersionKnowledgeBaseDocument) =>
      knowledgeBaseDocumentAdapter.fromDB(document)
    );
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
    query?: Omit<DocumentCreateOnePublicRequestParams, 'overwrite' | 'maxChunkSize'> & {
      overwrite?: boolean;
      maxChunkSize?: number;
    };
  }): Promise<KnowledgeBaseDocument> {
    const { overwrite = false, maxChunkSize = undefined, tags = undefined } = query;
    const tagsArray = Array.isArray(query.tags) ? query.tags : this.tagService.convertToArray(tags);

    let existingDocument: VersionKnowledgeBaseDocument | undefined;

    if (existingDocumentID) {
      existingDocument = await this.validateDocumentExists(projectID, existingDocumentID, true);
    }

    const project = await this.projectORM.findOneOrFail(projectID);
    const urlData = data.data as KBDocumentUrlData;

    urlData.name = this.strippedURL(urlData.url);

    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    this.checkExistingDocConflict(overwrite, existingDocumentID, collisionMap[urlData.url]);

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
      existingDocument = existingDocument ?? (await this.orm.findOneDocument(projectID, existingDocumentID));
      (existingDocument?.tags ?? []).forEach((tag) => tagObjects.add(tag));
    }

    const document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    } = {
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

    this.klParserProcessingCall({
      projectID,
      workspaceID: project.teamID,
      document,
      maxChunkSize,
    });

    return knowledgeBaseDocumentAdapter.fromDB({
      ...document,
      tags: Array.from(
        await this.tagService.tagObjectIdsToNames({
          assistantID: projectID,
          tagIDs: document?.tags ?? [],
        })
      ),
    });
  }

  async replaceFileDocument(
    projectID: string,
    userID: number,
    documentID: string,
    file: MulterFile,
    canEdit = true
  ): Promise<KnowledgeBaseDocument> {
    return this.uploadFileDocument({
      projectID,
      userID,
      file,
      canEdit,
      existingDocumentID: documentID,
      query: { overwrite: true },
    });
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
    query?: Omit<DocumentCreateOnePublicRequestParams, 'overwrite' | 'maxChunkSize'> & {
      overwrite?: boolean;
      maxChunkSize?: number;
    };
  }): Promise<KnowledgeBaseDocument> {
    const { overwrite = false, maxChunkSize = undefined, tags = undefined } = query;
    const tagsArray = Array.isArray(query.tags) ? query.tags : this.tagService.convertToArray(tags);

    let existingDocument: VersionKnowledgeBaseDocument | undefined;

    if (existingDocumentID) {
      existingDocument = await this.validateDocumentExists(projectID, existingDocumentID, true);
    }

    const project = await this.projectORM.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);

    const type: KnowledgeBaseDocumentType = this.getFileTypeByMimetype(file.mimetype, file.originalname);
    const s3ObjectRef: string = this.getKnowledgeBaseS3Key(projectID, file.originalname);

    this.checkExistingDocConflict(overwrite, existingDocumentID, collisionMap[s3ObjectRef]);

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
      existingDocument = existingDocument ?? (await this.orm.findOneDocument(projectID, existingDocumentID));
      (existingDocument?.tags ?? []).forEach((tag) => tagObjects.add(tag));
    }

    const data = {
      type,
      name: s3ObjectRef.split('/').pop()?.toString(),
    } as KBDocumentTextData;

    if (data.type === KnowledgeBaseDocumentType.TEXT) {
      data.canEdit = canEdit ?? false;
    }

    const document: Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    } = {
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

    this.klParserProcessingCall({
      projectID,
      workspaceID: project.teamID,
      document,
      maxChunkSize,
    });

    return knowledgeBaseDocumentAdapter.fromDB({
      ...document,
      tags: Array.from(
        await this.tagService.tagObjectIdsToNames({
          assistantID: projectID,
          tagIDs: document?.tags ?? [],
        })
      ),
    });
  }

  async uploadTableDocument(
    projectID: string,
    userID: number,
    data: DocumentUploadTableRequestData,
    overwrite = false
  ): Promise<DocumentUploadTableResponse> {
    const project = await this.projectORM.findOneOrFail(projectID);
    const existingDocuments: Omit<VersionKnowledgeBaseDocument, 'updatedAt'>[] = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents)
      : [];
    const collisionMap = this.getDocumentCollisionMap(existingDocuments);
    const { teamID } = project;

    const documentID = collisionMap[data.name];

    if (!overwrite && documentID) {
      throw new ConflictException('file already exists');
    }

    // Convert tagIDs to an array if it's a string, or set it to null if not provided
    const tagsArray = this.tagService.convertToArray(data.tags);

    this.validateInputTableSchema(data);

    await this.checkDocsPlanLimit(teamID, projectID, existingDocuments.length, 1);

    let existingRowsCount = 0;

    Object.values(project?.knowledgeBase?.documents ?? {}).forEach((document) => {
      if (document.data?.type === KnowledgeBaseDocumentType.TABLE) {
        const tableData = document.data as KBDocumentTableData;
        existingRowsCount += tableData.rowsCount;
      }
    });

    await this.checkKBTableRowsPlanLimit(projectID, existingRowsCount, data.items.length);

    let tagObjectIDs = new Set<string>();

    if (tagsArray) {
      // with force creation to true
      await this.tagService.checkKBTagLabelsExists({
        assistantID: projectID,
        tagLabels: tagsArray,
        createIfMissingTags: true,
      });
      tagObjectIDs = await this.tagService.tagNamesToObjectIds(projectID, tagsArray);
    }

    // if tags don't provided and document exists, keep existing tags with doc
    if (documentID && tagObjectIDs.size === 0) {
      const attachedTags = project?.knowledgeBase?.documents?.[documentID].tags ?? [];
      attachedTags.forEach((tagID) => tagObjectIDs.add(tagID));
    }

    const document = await this.createTable({
      data: {
        name: data.name,
        type: KnowledgeBaseDocumentType.TABLE,
        rowsCount: data.items.length,
      },
      projectID,
      teamID,
      creatorID: userID,
      documentID,
      tagObjectIDs: Array.from(tagObjectIDs),
      inputTableJSON: data,
    });

    return {
      data: {
        data: document.data,
        documentID: document.documentID,
        updatedAt: document.updatedAt?.toISOString() || '',
        status: document.status,
        tags: Array.from(
          await this.tagService.tagObjectIdsToNames({ assistantID: projectID, tagIDs: document?.tags ?? [] })
        ),
      },
    };
  }

  /* Find */

  async findOneDocument(assistantID: string, documentID: string) {
    const [document, chunks] = await Promise.all([
      this.orm.findOneDocument(assistantID, documentID),
      this.findDocumentChunks(assistantID, documentID),
    ]);

    if (!document) {
      throw new NotFoundException("Document doesn't exist");
    }

    return { ...knowledgeBaseDocumentAdapter.fromDB(document), chunks };
  }

  async findOneDocumentWithTags(assistantID: string, documentID: string) {
    const [document, chunks] = await Promise.all([
      this.orm.findOneDocument(assistantID, documentID),
      this.findDocumentChunks(assistantID, documentID),
    ]);

    if (!document) {
      throw new NotFoundException("Document doesn't exist");
    }

    return {
      ...knowledgeBaseDocumentAdapter.fromDB(document),
      chunks,
      tags: Array.from(await this.tagService.tagObjectIdsToNames({ assistantID, tagIDs: document?.tags ?? [] })),
    };
  }

  async findManyDocuments(assistantID: string, documentIDs?: string[]): Promise<KnowledgeBaseDocument[]> {
    const documents = documentIDs
      ? await this.orm.findManyDocuments(assistantID, documentIDs)
      : await this.orm.findAllDocuments(assistantID);

    // mark with an ERROR status documents that have not completed processing within 5 minutes
    await this.syncDocuments(assistantID, documents);

    return documents.map((document: VersionKnowledgeBaseDocument) => knowledgeBaseDocumentAdapter.fromDB(document));
  }

  async findDocumentChunks(assistantID: string, documentID: string): Promise<KBDocumentChunk[]> {
    try {
      const file = await this.file.downloadFile(UploadType.KB_DOCUMENT, `${assistantID}/embeddings/${documentID}.json`);

      const rawChunks = file ? z.array(KBDocumentInsertChunkDTO).parse(JSON.parse(await file.transformToString())) : [];

      return rawChunks
        ? rawChunks.map(({ id, metadata }) => ({
            chunkID: id,
            content: metadata.content,
          }))
        : [];
    } catch {
      return [];
    }
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

    const includeTagsArray = Array.isArray(query.includeTags)
      ? query.includeTags
      : this.tagService.convertToArray(includeTags);
    const excludeTagsArray = Array.isArray(query.excludeTags)
      ? query.excludeTags
      : this.tagService.convertToArray(excludeTags);

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

  async validateDocumentExists(assistantID: string, documentID: string, checkFinishedStatus = false) {
    const document = await this.orm.findOneDocument(assistantID, documentID);
    if (!document) throw new NotFoundException("Document doesn't exist");

    if (checkFinishedStatus && !this.KB_DOC_FINISH_STATUSES.has(document.status.type.toString())) {
      throw new BadRequestException('document still in processing, please wait until processing finished');
    }

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

  async patchOneDocument(assistantID: string, documentID: string, document: DocumentPatchOneRequest) {
    const project = await this.projectORM.findOneOrFail(assistantID);

    const doc = await this.findOneDocument(assistantID, documentID);

    const { checksum, ...documentForUpdate } = document;

    if (checksum) {
      this.refreshJobService.updateChecksum(assistantID, documentID, checksum);
    }

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

    await this.orm.patchOneDocument(assistantID, documentID, documentForUpdate);
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
    const project = await this.projectORM.findOneOrFail(assistantID);
    const documents = await this.findManyDocuments(assistantID, documentIDs);
    const refreshRatesDocuments: (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt'> & {
      documentID: string;
      updatedAt: Date;
    })[] = [];

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

    await this.refreshJobsORM.deleteManyByDocumentIDs(assistantID, ids);

    await this.orm.deleteManyDocuments(assistantID, ids);
  }

  /* Refresh & retry */

  async refreshManyDocuments(ids: string[], assistantID: string) {
    // todo: remove after migration to postgres
    if (ids.length > this.MAX_CONCURRENT_DOCUMENTS) {
      throw new BadRequestException('too many documents');
    }

    const project = await this.projectORM.findOneOrFail(assistantID);
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
    await this.refreshJobService.sendRefreshJobs(
      assistantID,
      filteredDocs,
      project.teamID,
      AmqpQueueMessagePriority.MEDIUM
    );
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
      const project = await this.projectORM.findOneOrFail(assistantID);

      this.klParserProcessingCall({
        projectID: assistantID,
        workspaceID: project.teamID,
        document: updatedDocument,
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
    const [document, workspaceID] = await Promise.all([
      this.validateDocumentExists(assistantID, documentID, true),
      this.orm.getWorkspaceID(assistantID),
    ]);

    await this.tagService.checkKBTagLabelsExists({ assistantID, tagLabels });
    const tagsIds = Array.from(await this.tagService.tagNamesToObjectIds(assistantID, tagLabels));

    const tagsToAdd = tagsIds.filter((value) => !(document?.tags ?? []).includes(value));

    await this.tagService.limitKBTagsDocument(document, tagsToAdd.length);

    await this.orm.attachManyTagsToDocument(assistantID, documentID, tagsToAdd);

    await this.refreshJobsORM.attachManyTags(assistantID, documentID, tagsToAdd);

    this.updateKBParserTags(assistantID, workspaceID, {
      ...document,
      tags: Array.from(new Set(tagsToAdd.concat(document?.tags ?? []))),
    });
  }

  async detachTagsOneDocument(assistantID: string, documentID: string, tagLabels: string[]) {
    const [document, workspaceID] = await Promise.all([
      this.validateDocumentExists(assistantID, documentID, true),
      this.orm.getWorkspaceID(assistantID),
    ]);

    await this.tagService.checkKBTagLabelsExists({ assistantID, tagLabels });
    const tagsIds = Array.from(await this.tagService.tagNamesToObjectIds(assistantID, tagLabels));

    const tagsToRemove = tagsIds.filter((value) => (document?.tags ?? []).includes(value));

    await this.orm.detachManyTagsFromDocument(assistantID, documentID, tagsToRemove);

    await this.refreshJobsORM.detachManyTags(assistantID, documentID, tagsToRemove);

    this.updateKBParserTags(assistantID, workspaceID, {
      ...document,
      tags: (document?.tags ?? []).filter((value) => !tagsToRemove.includes(value)),
    });
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

  public async resolveWorkspaceID(assistantID: string) {
    return this.orm.getWorkspaceID(assistantID);
  }

  private validateInputTableSchema(data: {
    name: string;
    searchableFields: string[];
    items: object[];
    metadataFields?: string[];
  }): void {
    this.checkSearchableFields(data.searchableFields);
    this.checkItems(data.items, data.searchableFields);
  }

  private checkSearchableFields(searchableFields: string[]): void {
    if (!searchableFields || searchableFields.length === 0) {
      throw new BadRequestException('searchableFields field cannot be empty');
    }
  }

  private checkItems(items: object[], searchableFields: string[]): void {
    if (!items || items.length === 0) {
      throw new BadRequestException('items field cannot be empty');
    }

    items.forEach((item) => {
      this.checkItemFields(item, searchableFields);
    });
  }

  private checkItemFields(item: { [key: string]: any }, searchableFields: string[]): void {
    let hasNonNullValue = false; // Flag to track if any non-null value is encountered

    searchableFields.forEach((field) => {
      if (!(field in item)) {
        throw new BadRequestException(`field "${field}" is missing in one or more items`);
      }

      const value = item[field];
      if (value !== null && value !== '') {
        hasNonNullValue = true; // Set flag to true if non-null value is encountered
        this.checkPrimitiveType(item[field], field);
      }
    });

    // Check if all searchableFields are null
    if (!hasNonNullValue) {
      throw new BadRequestException('At least one field in searchableFields must have a non-null value in each item');
    }
  }

  private checkPrimitiveType(value: any, field: string): void {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new BadRequestException(`field "${field}" must be a primitive type (number, string) or null`);
    }
  }

  async checkKBTableRowsPlanLimit(projectID: string, existingRows: number, newRows: number) {
    const message = 'maximum number of table rows exceeded';

    try {
      const response = await this.billingClient.authorizationPrivate.authorize({
        resourceID: projectID,
        resourceType: BillingResourceType.PROJECT,
        item: BillingAuthorizeItemName.KnowledgeBaseSourceRows,
        value: newRows,
        currentValue: existingRows,
      });

      if (!response[BillingAuthorizeItemName.KnowledgeBaseSourceRows]) {
        throw new ForbiddenException(message);
      }
    } catch (error) {
      throw new NotAcceptableException(message);
    }
  }

  async createTable({
    data,
    projectID,
    teamID,
    creatorID,
    documentID,
    tagObjectIDs,
    inputTableJSON,
  }: {
    data: KBDocumentTableData;
    projectID: string;
    creatorID: number;
    teamID: number;
    documentID?: string;
    tagObjectIDs: string[];
    inputTableJSON: {
      name: string;
      searchableFields: string[];
      items: object[];
      metadataFields?: string[];
      tags?: string[];
    };
  }) {
    const document: Omit<VersionKnowledgeBaseDocument, 's3ObjectRef'> = {
      status: { type: KnowledgeBaseDocumentStatus.PENDING },
      data,
      updatedAt: new Date(),
      creatorID,
      documentID: documentID ?? new ObjectId().toHexString(),
      tags: tagObjectIDs,
    };

    await this.tagService.limitKBTagsDocument(document);

    this.orm.upsertOneDocument(projectID, document);

    this.createKBTableDocument({
      projectID,
      workspaceID: teamID.toString(),
      document,
      searchableFields: inputTableJSON.searchableFields,
      items: inputTableJSON.items,
      metadataFields: inputTableJSON.metadataFields,
    });

    return document;
  }

  async createKBTableDocument({
    projectID,
    workspaceID,
    document,
    searchableFields,
    items,
    metadataFields,
  }: {
    projectID: string;
    workspaceID: string;
    document: Omit<VersionKnowledgeBaseDocument, 's3ObjectRef'>;
    searchableFields: string[];
    items: object[];
    metadataFields?: string[];
  }) {
    await this.klParserClient.uploadTable(workspaceID, projectID, document, searchableFields, items, metadataFields);
  }

  async updateKBParserTags(assistantID: string, workspaceID: number, document: VersionKnowledgeBaseDocument) {
    await this.klParserClient.updateDocument(
      assistantID,
      { ...document, updatedAt: new Date() },
      workspaceID.toString(),
      {
        chunkStrategy: { type: BaseModels.Project.ChunkStrategyType.RECURSIVE_TEXT_SPLITTER },
      }
    );
  }
}
