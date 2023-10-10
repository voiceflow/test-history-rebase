import { ConfigurableModuleBuilder } from '@nestjs/common';

import type { FileModuleOptions } from './file.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<FileModuleOptions>().build();
