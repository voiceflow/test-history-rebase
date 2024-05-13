import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDocumentIntegrationType, KnowledgeBaseDocumentRefreshRate, KnowledgeBaseDocumentType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';
import { ProjectService } from '@/project/project.service';

import { IntegrationFindManyResponse } from './dtos/integration-find.dto';
import { RefreshJobsOrm } from '@voiceflow/orm-designer';

@Injectable()
export class IntegrationOauthTokenService extends MutableService<IntegrationOauthTokenORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(IntegrationOauthTokenORM)
    protected readonly orm: IntegrationOauthTokenORM,
    @Inject(TokenEncryptionService)
    protected readonly tokenEncryption: TokenEncryptionService,
    @Inject(ProjectService)
    protected readonly project: ProjectService,
    @Inject(RefreshJobsOrm)
    protected readonly refreshJobs: RefreshJobsOrm
  ) {
    super();
  }

  async getIntegrationTokensMapping(integrationTokenIDSet: Set<number>): Promise<Record<number, string>> {
    const integrationTokensArray = await this.orm.find({ id: [...integrationTokenIDSet] });

    return integrationTokensArray.reduce((acc, obj) => {
      const { id, accessToken } = obj;
      acc[id] = this.tokenEncryption.decrypt(accessToken.toString());
      return acc;
    }, {} as Record<number, string>);
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

  async deleteIntegration(assistantID: string, integrationType = 'zendesk'): Promise<void> {
    // TODO: Change this to get from 'resolver' according to integration type
    const integrationName = integrationType;

    let project;
    try {
      project = await this.project.findOneOrFailWithFields(assistantID, ['knowledgeBase']);
    } catch {
      throw new NotFoundException('Project not found');
    }

    // get oauth integration token
    const integrationToken = await this.orm.findOneByType(assistantID, integrationName);
    if (!integrationToken?.length) return;

    const existingURLDocuments = project?.knowledgeBase?.documents
      ? Object.values(project.knowledgeBase.documents).filter(
          ({ documentID, data }) => !!documentID && data?.type === KnowledgeBaseDocumentType.URL && data?.accessTokenID === integrationToken[0].id
        )
      : [];
    const urlDocumentIds = existingURLDocuments.map((d) => d.documentID);

    await this.orm.deleteTypeByProject(assistantID, integrationName);

    await this.project.unsetDocumentsAccessToken(assistantID, urlDocumentIds);

    await this.refreshJobs.deleteManyByDocumentIDs(assistantID, urlDocumentIds);

    await this.project.updateDocumentsRefreshRate(assistantID, urlDocumentIds, KnowledgeBaseDocumentRefreshRate.NEVER);
  }
}
