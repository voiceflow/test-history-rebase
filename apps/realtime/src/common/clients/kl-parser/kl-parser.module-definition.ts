import { ConfigurableModuleBuilder } from '@nestjs/common';

import { KlParserModuleOptions } from './kl-parser.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: KL_PARSER_MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KlParserModuleOptions>().build();
