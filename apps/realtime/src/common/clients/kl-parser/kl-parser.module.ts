import { Global, Module } from '@nestjs/common';

import { KlParserClient } from './kl-parser.client';
import { ConfigurableModuleClass } from './kl-parser.module-definition';

@Global()
@Module({
  exports: [KlParserClient],
  providers: [KlParserClient],
})
export class KlParserModule extends ConfigurableModuleClass {}
