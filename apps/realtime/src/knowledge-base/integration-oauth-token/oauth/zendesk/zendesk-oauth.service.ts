import { Inject, Injectable } from '@nestjs/common';
import {
  AmqpQueueMessagePriority,
  KBDocumentUrlData,
  KnowledgeBaseDocumentRefreshRate,
  KnowledgeBaseDocumentStatus,
  KnowledgeBaseDocumentType,
  VersionKnowledgeBaseDocument,
} from '@voiceflow/dtos';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';
import { ObjectId } from 'bson';

import { MutableService } from '@/common';
import { IntegrationType } from '@/common/clients/integrations/base/dtos/base-oauth-type.enum';
import { ZendeskOauthClient } from '@/common/clients/integrations/zendesk/zendesk-oauth.client';
import { ZendeskArticle, ZendeskCountFilters } from '@/common/clients/integrations/zendesk/zendesk-oauth.interface';
import { RefreshJobService } from '@/knowledge-base/document/refresh-job.service';

import { KnowledgeBaseDocumentService } from '../../../document/document.service';
import OauthService from '../base/base-oauth.interface';

@Injectable()
export class ZendeskOauthService extends MutableService<KnowledgeBaseORM> implements OauthService {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(RefreshJobService)
    private readonly refreshJobService: RefreshJobService,
    @Inject(ZendeskOauthClient)
    protected readonly zendeskClient: ZendeskOauthClient,
    @Inject(KnowledgeBaseDocumentService)
    protected readonly knowledgeBase: KnowledgeBaseDocumentService
  ) {
    super();
  }

  private async runFetchingLoop({
    projectID,
    creatorID,
    integrationTokenID,
    accessToken,
    integrationDocuments,
    workspaceID,
    filters,
    existingDocsSetIDs,
    userSegmentIds,
    localesSetIds,
    refreshRate = KnowledgeBaseDocumentRefreshRate.NEVER,
  }: {
    projectID: string;
    creatorID: number;
    integrationTokenID: number;
    accessToken: string;
    workspaceID: number;
    integrationDocuments: Record<string, string>;
    filters?: ZendeskCountFilters;
    existingDocsSetIDs: Set<string>;
    userSegmentIds?: Set<number | null>;
    localesSetIds?: Set<string | undefined>;
    refreshRate?: KnowledgeBaseDocumentRefreshRate;
  }) {
    const { resourceKey, endpoint } = this.zendeskClient.getArticlesEndpoint(filters);

    const subdomain = filters?.brands?.[0]?.subdomain;

    const fetchedArticles = await this.zendeskClient.fetchAllItems({ accessToken, filters, resourceKey, endpoint, subdomain });

    const documents = this.extractDocuments({
      articles: fetchedArticles as ZendeskArticle[],
      integrationDocuments,
      refreshRate,
      integrationTokenID,
      creatorID,
      localesSetIds,
      userSegmentIds,
    });

    const newDocsSetIDs = new Set(documents.map((document) => document.documentID));

    await this.knowledgeBase.checkDocsPlanLimit(workspaceID, projectID, existingDocsSetIDs.size, newDocsSetIDs.size);

    await this.orm.updateIntegrationDocuments(projectID, documents);

    await this.knowledgeBase.syncRefreshJobs(projectID, workspaceID, documents);

    // could be quite huge amount - MEDIUM priority, less then usual creation docs though ui, but higher than backgound refresh
    this.refreshJobService.sendRefreshJobs(projectID, documents, workspaceID, AmqpQueueMessagePriority.MEDIUM);
  }

  private extractDocuments({
    articles,
    integrationDocuments,
    refreshRate,
    integrationTokenID,
    creatorID,
    userSegmentIds,
    localesSetIds,
  }: {
    articles: ZendeskArticle[];
    integrationDocuments: Record<string, string>;
    refreshRate: KnowledgeBaseDocumentRefreshRate;
    integrationTokenID: number;
    creatorID: number;
    userSegmentIds?: Set<number | null>;
    localesSetIds?: Set<string | undefined>;
  }): (Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt' | 'data' | 'status' | 'creatorID'> & {
    creatorID: number;
    documentID: string;
    updatedAt: Date;
    data: KBDocumentUrlData;
    status: {
      type: KnowledgeBaseDocumentStatus;
    };
  })[] {
    const { filteredArticles } = this.zendeskClient.filterArticles({
      fetchedArticles: articles,
      userSegmentIds,
      localesSetIds,
      userSegmentsMapping: {},
      includeUserSegments: false,
    });

    return filteredArticles.map((article) =>
      this.extractDocument({ article: article as ZendeskArticle, integrationDocuments, refreshRate, integrationTokenID, creatorID })
    );
  }

  private extractDocument({
    article,
    integrationDocuments,
    refreshRate,
    integrationTokenID,
    creatorID,
  }: {
    article: ZendeskArticle;
    integrationDocuments: Record<string, string>;
    refreshRate: KnowledgeBaseDocumentRefreshRate;
    integrationTokenID: number;
    creatorID: number;
  }): Omit<VersionKnowledgeBaseDocument, 'documentID' | 'updatedAt' | 'data' | 'status' | 'creatorID'> & {
    creatorID: number;
    documentID: string;
    updatedAt: Date;
    data: KBDocumentUrlData;
    status: {
      type: KnowledgeBaseDocumentStatus;
    };
  } {
    const externalArticleID = article.id.toString();
    let documentID: string = new ObjectId().toHexString();

    if (externalArticleID in integrationDocuments) {
      documentID = integrationDocuments[externalArticleID] ?? documentID;
    }

    const docData: KBDocumentUrlData = {
      type: KnowledgeBaseDocumentType.URL,
      name: this.knowledgeBase.strippedURL(article.html_url),
      url: article.url,
      refreshRate,
      accessTokenID: integrationTokenID,
      integrationExternalID: article.id.toString(),
      source: IntegrationType.ZENDESK,
    };

    return {
      documentID,
      status: { type: KnowledgeBaseDocumentStatus.PENDING },
      data: docData,
      updatedAt: new Date(),
      creatorID,
      tags: [],
    };
  }

  async uploadDocsByFilters({
    projectID,
    creatorID,
    integrationTokenID,
    accessToken,
    filters,
    refreshRate = KnowledgeBaseDocumentRefreshRate.NEVER,
  }: {
    projectID: string;
    creatorID: number;
    integrationTokenID: number;
    accessToken: string;
    subdomain: string;
    filters?: ZendeskCountFilters;
    refreshRate?: KnowledgeBaseDocumentRefreshRate;
  }): Promise<void> {
    const [documents, workspaceID] = await Promise.all([this.orm.findAllDocuments(projectID), this.orm.getWorkspaceID(projectID)]);

    const existingDocsSetIDs: Set<string> = new Set();

    const existingURLDocuments =
      documents.length !== 0
        ? documents.filter(({ documentID, data }) => {
            existingDocsSetIDs.add(documentID);

            return !!documentID && data?.type === KnowledgeBaseDocumentType.URL && data?.source === IntegrationType.ZENDESK;
          })
        : [];

    const integrationDocuments: Record<string, string> = {};

    existingURLDocuments.forEach((document) => {
      const dataUrl = document.data as KBDocumentUrlData;
      const integrationExternalID = dataUrl?.integrationExternalID;

      if (integrationExternalID !== undefined) {
        integrationDocuments[integrationExternalID] = document.documentID;
      }
    });

    let userSegmentIds: Set<number | null> | undefined;
    let localesSetIds: Set<string | undefined> | undefined;

    if (filters?.userSegments?.length) {
      userSegmentIds = new Set((filters?.userSegments ?? []).map((segment) => segment.filterID));
    }

    if (filters?.locales?.length) {
      localesSetIds = new Set((filters?.locales ?? []).map((locale) => locale.locale?.toLowerCase()));
    }

    await this.runFetchingLoop({
      projectID,
      creatorID,
      integrationTokenID,
      accessToken,
      filters,
      integrationDocuments,
      workspaceID,
      existingDocsSetIDs,
      userSegmentIds,
      localesSetIds,
      refreshRate,
    });
  }
}
