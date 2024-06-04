import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, KnowledgeBaseORM, ProjectORM, RefreshJobsOrm } from '@voiceflow/orm-designer';

import { CacheService } from '@/cache/cache.service';
import { KnowledgeBaseSettingsModule } from '@/knowledge-base/settings/settings.module';
import { KnowledgeBaseSettingsService } from '@/knowledge-base/settings/settings.service';
import { ProjectModule } from '@/project/project.module';
import { VersionModule } from '@/version/version.module';

import { KnowledgeBaseDocumentService } from '../document/document.service';
import { RefreshJobService } from '../document/refresh-job.service';
import { KnowledgeBaseTagService } from '../tag/tag.service';
import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';
import { ZendeskOauthService } from './oauth/zendesk/zendesk-oauth.service';

@Global()
@Module({
  imports: [KnowledgeBaseSettingsModule, VersionModule, ProjectModule],
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
    KnowledgeBaseSettingsService,
    CacheService,
  ],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule {}
