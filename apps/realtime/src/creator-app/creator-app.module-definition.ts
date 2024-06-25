import { ConfigurableModuleBuilder } from '@nestjs/common';

import type { CreatorAppModuleOptions } from './creator-app.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: CREATOR_APP_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CreatorAppModuleOptions>().build();
