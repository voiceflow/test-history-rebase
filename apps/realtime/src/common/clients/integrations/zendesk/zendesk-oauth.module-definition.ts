import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ZendeskOauthModuleOptions } from './zendesk-oauth.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: ZENDESK_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ZendeskOauthModuleOptions>().build();
