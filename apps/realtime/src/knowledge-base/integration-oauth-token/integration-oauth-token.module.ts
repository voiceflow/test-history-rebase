import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';

import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { ConfigurableModuleClass } from './integration-oauth-token.module-definition';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';
import { RefreshJobsOrm } from '@voiceflow/orm-designer';
import { ProjectModule } from '@/project/project.module';

@Global()
@Module({
  imports: [ProjectModule],
  exports: [IntegrationOauthTokenService],
  providers: [IntegrationOauthTokenService, IntegrationOauthTokenORM, TokenEncryptionService, RefreshJobsOrm],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule extends ConfigurableModuleClass {}
