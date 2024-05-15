import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDocumentIntegrationType, KnowledgeBaseDocumentRefreshRate, KnowledgeBaseDocumentType } from '@voiceflow/dtos';
import { BadRequestException } from '@voiceflow/exception';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, RefreshJobsOrm } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { AesEncryptionClient } from '@/common/clients/aes-encryption/aes-encryption.client';
import BaseOauthClient from '@/common/clients/integrations/base/base-oauth.interface';
import { IntegrationType } from '@/common/clients/integrations/base/dtos/base-oauth-type.enum';
import { ZendeskOauthClient } from '@/common/clients/integrations/zendesk/zendesk-oauth.client';
import OauthService from '@/knowledge-base/integration-oauth-token/oauth/base/base-oauth.interface';
import { ZendeskOauthService } from '@/knowledge-base/integration-oauth-token/oauth/zendesk/zendesk-oauth.service';

import { IntegrationAuthUrlParams, IntegrationAuthUrlResponse } from './dtos/integration-auth-url.dto';
import { IntegrationCallbackParams } from './dtos/integration-callback.dto';
import {
  ZendeskArticlesUploadRequest,
  ZendeskCountByFiltersResponse,
  ZendeskFiltersResponse,
  ZendeskUserSegmentsRequest,
} from './dtos/integration-filters.dto';
import { IntegrationFindManyResponse } from './dtos/integration-find.dto';

export interface IntegrationHandler {
  client: BaseOauthClient;
  service: OauthService;
}

@Injectable()
export class IntegrationOauthTokenService extends MutableService<IntegrationOauthTokenORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  // eslint-disable-next-line max-params
  constructor(
    @Inject(IntegrationOauthTokenORM)
    protected readonly orm: IntegrationOauthTokenORM,
    @Inject(KnowledgeBaseORM)
    protected readonly knowledgeBaseOrm: KnowledgeBaseORM,
    @Inject(AesEncryptionClient)
    protected readonly aesEncryptionClient: AesEncryptionClient,
    @Inject(ZendeskOauthClient)
    protected readonly zendeskClient: ZendeskOauthClient,
    @Inject(RefreshJobsOrm)
    protected readonly refreshJobs: RefreshJobsOrm,
    @Inject(ZendeskOauthService)
    protected readonly zendeskService: ZendeskOauthService
  ) {
    super();
  }

  resolveIntegrationHandler(integrationType: string): IntegrationHandler {
    // rewrite to switch in future
    if (integrationType === IntegrationType.ZENDESK) {
      return {
        client: this.zendeskClient,
        service: this.zendeskService,
      };
    }

    throw new BadRequestException("Invalid integration type, haven't implemented yet");
  }

  async getManyIntegrationTokens(assistantID: string): Promise<IntegrationFindManyResponse> {
    const integrations = await this.orm.findManyByAssistant(assistantID);
    return {
      data: integrations.map(({ type, state, creatorID, createdAt }: { type: string; state: string; creatorID: number | null; createdAt: Date }) => ({
        type: type as KnowledgeBaseDocumentIntegrationType,
        state,
        creatorID,
        createdAt: createdAt?.toISOString(),
      })),
    };
  }

  async deleteIntegration(assistantID: string, integrationType: IntegrationType = IntegrationType.ZENDESK): Promise<void> {
    const { client } = this.resolveIntegrationHandler(integrationType);

    // get oauth integration token
    const integrationToken = await this.orm.findOneByType(assistantID, client.type);
    if (!integrationToken?.length) return;

    const existingDocuments = await this.knowledgeBaseOrm.findAllDocuments(assistantID);

    const existingURLDocuments = existingDocuments.filter(
      ({ documentID, data }) => !!documentID && data?.type === KnowledgeBaseDocumentType.URL && data?.accessTokenID === integrationToken[0].id
    );
    const urlDocumentIds = existingURLDocuments.map((d) => d.documentID);

    await this.orm.deleteOneByType(assistantID, client.type);

    await this.knowledgeBaseOrm.unsetDocumentsAccessToken(assistantID, urlDocumentIds);

    await this.refreshJobs.deleteManyByDocumentIDs(assistantID, urlDocumentIds);

    await this.knowledgeBaseOrm.updateDocumentsRefreshRate(assistantID, urlDocumentIds, KnowledgeBaseDocumentRefreshRate.NEVER);
  }

  async getAuthUrlIntegration({
    assistantID,
    creatorID,
    query,
    host,
    integrationType = IntegrationType.ZENDESK,
    overwrite = false,
  }: {
    assistantID: string;
    creatorID: number;
    query: IntegrationAuthUrlParams;
    host: string;
    integrationType: IntegrationType;
    overwrite?: boolean;
  }): Promise<IntegrationAuthUrlResponse> {
    const { client } = this.resolveIntegrationHandler(integrationType);

    if (client.type === IntegrationType.ZENDESK && !query.subdomain && !overwrite) {
      throw new BadRequestException('subdomain required for zendesk integration');
    }

    let clientSubdomain: string | undefined = query.subdomain;

    if (overwrite) {
      const integrationToken = await this.orm.findOneByType(assistantID, client.type);
      if (!integrationToken?.length) {
        throw new BadRequestException('integration not found');
      }
      clientSubdomain = integrationToken[0].subdomain ?? undefined;
    }

    const callbackEndpoint = `/integrations/${integrationType}/callback`;

    const redirectHost = `https://${host}`;

    return {
      data: {
        url: client.getAuthPageUrl({
          creatorID,
          projectID: assistantID,
          scope: 'read',
          redirectUrl: query.redirectUrl ?? `${redirectHost}${callbackEndpoint}`,
          overwrite,
          subdomain: clientSubdomain,
        }),
      },
    };
  }

  async fetchFiltersIntegration({
    assistantID,
    query,
    integrationType = IntegrationType.ZENDESK,
  }: {
    assistantID: string;
    query: IntegrationAuthUrlParams;
    integrationType: IntegrationType;
  }): Promise<ZendeskFiltersResponse> {
    const { client } = this.resolveIntegrationHandler(integrationType);
    const integrationToken = await this.orm.findOneByType(assistantID, client.type);

    if (!integrationToken?.length) {
      throw new BadRequestException('integration not found');
    }

    const accessToken = this.aesEncryptionClient.decrypt(integrationToken[0].accessToken);

    return { data: await client.fetchFilters(accessToken, integrationToken[0].subdomain ?? '', query.subdomain) };
  }

  async fetchCountByFiltersIntegration({
    assistantID,
    body,
    integrationType = IntegrationType.ZENDESK,
  }: {
    assistantID: string;
    integrationType: IntegrationType;
    body?: ZendeskUserSegmentsRequest;
  }): Promise<ZendeskCountByFiltersResponse> {
    const { client } = this.resolveIntegrationHandler(integrationType);
    const integrationToken = await this.orm.findOneByType(assistantID, integrationType);

    if (!integrationToken?.length) {
      throw new BadRequestException('integration not found');
    }

    const accessToken = this.aesEncryptionClient.decrypt(integrationToken[0].accessToken);
    return { data: await client.fetchCountByFilters(accessToken, body?.data?.filters) } as ZendeskCountByFiltersResponse;
  }

  async uploadDocsByFiltersIntegration({
    assistantID,
    creatorID,
    body,
    integrationType = IntegrationType.ZENDESK,
  }: {
    assistantID: string;
    creatorID: number;
    integrationType: IntegrationType;
    body?: ZendeskArticlesUploadRequest;
  }): Promise<void> {
    const { service } = this.resolveIntegrationHandler(integrationType);
    const integrationToken = await this.orm.findOneByType(assistantID, integrationType);

    if (!integrationToken?.length) {
      throw new BadRequestException('integration not found');
    }

    const accessToken = this.aesEncryptionClient.decrypt(integrationToken[0].accessToken);

    await service.uploadDocsByFilters({
      projectID: assistantID,
      creatorID,
      integrationTokenID: integrationToken[0].id,
      accessToken,
      filters: body?.data?.filters,
      refreshRate: body?.data?.refreshRate,
    });
  }

  async callbackIntegration({
    query,
    host,
    integrationType = IntegrationType.ZENDESK,
  }: {
    query: IntegrationCallbackParams;
    host: string;
    integrationType: IntegrationType;
  }): Promise<void> {
    const { client } = this.resolveIntegrationHandler(integrationType);

    const stateParams: { creatorID: number; projectID: string; overwrite: boolean; subdomain: string } = JSON.parse(
      this.aesEncryptionClient.decrypt(query.state)
    );

    const integrationToken = await this.orm.findOneByType(stateParams.projectID, client.type);
    if (integrationToken?.length && !stateParams.overwrite) {
      throw new BadRequestException('integration already exists');
    }

    const callbackEndpoint = `/integrations/${integrationType}/callback`;

    const redirectHost = `https://${host}`;

    const accessToken = await client.fetchAccessToken({
      code: query.code,
      scope: 'read',
      redirectUrl: query.redirectUrl ?? `${redirectHost}${callbackEndpoint}`,
      subdomain: stateParams.subdomain,
    });
    const encryptedAccessToken = this.aesEncryptionClient.encrypt(accessToken);

    await this.orm.upsertByAssistant(stateParams.projectID, client.type, encryptedAccessToken, stateParams.creatorID, stateParams.subdomain);
  }
}
