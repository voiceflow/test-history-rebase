import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ProjectPlatformModuleOptions } from './project-platform.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: PROJECT_PLATFORM_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ProjectPlatformModuleOptions>().build();
