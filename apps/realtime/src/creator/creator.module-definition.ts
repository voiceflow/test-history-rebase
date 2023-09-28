import { ConfigurableModuleBuilder } from '@nestjs/common';

import { CreatorModuleOptions } from './creator.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: CREATOR_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CreatorModuleOptions>().build();
