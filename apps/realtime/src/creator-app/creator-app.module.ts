import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './creator-app.module-definition';
import { CreatorAppService } from './creator-app.service';

@Global()
@Module({
  exports: [CreatorAppService],
  providers: [CreatorAppService],
})
export class CreatorAppModule extends ConfigurableModuleClass {}
