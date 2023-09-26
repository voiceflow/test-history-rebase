import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './creator.module-definition';
import { CreatorService } from './creator.service';

@Global()
@Module({
  providers: [CreatorService],
  exports: [CreatorService],
})
export class CreatorModule extends ConfigurableModuleClass {}
