import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM, RefreshJobsOrm } from '@voiceflow/orm-designer';

import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';
import { ProjectModule } from '@/project/project.module';

import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { ConfigurableModuleClass } from './integration-oauth-token.module-definition';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';

@Global()
@Module({
  imports: [ProjectModule],
  exports: [IntegrationOauthTokenService],
  providers: [IntegrationOauthTokenService, IntegrationOauthTokenORM, TokenEncryptionService, RefreshJobsOrm],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule extends ConfigurableModuleClass {}
