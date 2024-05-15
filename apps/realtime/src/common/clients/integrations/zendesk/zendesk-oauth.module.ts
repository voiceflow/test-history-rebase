import { Global, Module } from '@nestjs/common';

import { ZendeskOauthClient } from './zendesk-oauth.client';
import { ConfigurableModuleClass } from './zendesk-oauth.module-definition';

@Global()
@Module({
  exports: [ZendeskOauthClient],
  providers: [ZendeskOauthClient],
})
export class ZendeskOauthModule extends ConfigurableModuleClass {}
