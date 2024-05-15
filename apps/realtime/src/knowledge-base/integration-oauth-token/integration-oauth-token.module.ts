import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';

import { KnowledgeBaseDocumentService } from '../document/document.service';
import { RefreshJobService } from '../document/refresh-job.service';
import { KnowledgeBaseTagService } from '../tag/tag.service';
import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';
import { ZendeskOauthService } from './oauth/zendesk/zendesk-oauth.service';

@Global()
@Module({
  exports: [IntegrationOauthTokenService],
  providers: [
    KnowledgeBaseORM,
    IntegrationOauthTokenService,
    IntegrationOauthTokenORM,
    RefreshJobsOrm,
    ZendeskOauthService,
    RefreshJobService,
    KnowledgeBaseDocumentService,
    ProjectORM,
    KnowledgeBaseDocumentService,
    KnowledgeBaseTagService,
  ],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule {}
