import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';

import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { ConfigurableModuleClass } from './integration-oauth-token.module-definition';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';
import { RefreshJobService } from '../document/refresh-job.service';
import { KnowledgeBaseDocumentModule } from '../document/document.module';

@Global()
@Module({
  imports: [KnowledgeBaseDocumentModule],
  exports: [IntegrationOauthTokenService],
  providers: [RefreshJobService, IntegrationOauthTokenService, IntegrationOauthTokenORM, TokenEncryptionService],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule extends ConfigurableModuleClass {}
