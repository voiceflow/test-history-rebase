import { Global, Module } from '@nestjs/common';
import { IntegrationOauthTokenORM } from '@voiceflow/orm-designer';

import { TokenEncryptionService } from '@/knowledge-base/integration-oauth-token/token-encryption.service';

import { ConfigurableModuleClass } from './integration-oauth-token.module-definition';
import { IntegrationOauthTokenService } from './integration-oauth-token.service';

@Global()
@Module({
  exports: [IntegrationOauthTokenService],
  providers: [IntegrationOauthTokenService, IntegrationOauthTokenORM, TokenEncryptionService],
})
export class IntegrationOauthTokenModule extends ConfigurableModuleClass {}
