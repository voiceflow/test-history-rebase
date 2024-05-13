import { Global, Module, forwardRef } from '@nestjs/common';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';

import { KnowledgeBaseIntegrationsPublicHTTPController } from './integration-oauth-public.controller';
import { ConfigurableModuleClass } from './integration-oauth-token.module-definition';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';
import { KnowledgeBaseDocumentService } from '../document/document.service';
import { KnowledgeBaseDocumentModule } from '../document/document.module';

@Global()
@Module({
  imports: [forwardRef(() => KnowledgeBaseDocumentModule)],
  exports: [IntegrationOauthTokenService],
  providers: [IntegrationOauthTokenService, IntegrationOauthTokenORM, TokenEncryptionService, KnowledgeBaseDocumentService],
  controllers: [KnowledgeBaseIntegrationsPublicHTTPController],
})
export class IntegrationOauthTokenModule extends ConfigurableModuleClass {}
