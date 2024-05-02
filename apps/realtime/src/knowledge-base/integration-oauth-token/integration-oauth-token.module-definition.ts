import { ConfigurableModuleBuilder } from '@nestjs/common';

import { IntegrationOauthTokenModuleOptions } from './integration-oauth-token.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: INTEGRATION_OAUTH_TOKEN_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IntegrationOauthTokenModuleOptions>().build();
