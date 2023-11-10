import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './project-platform.module-definition';
import { ProjectPlatformService } from './project-platform.service';

@Global()
@Module({
  providers: [ProjectPlatformService],
  exports: [ProjectPlatformService],
})
export class ProjectPlatformModule extends ConfigurableModuleClass {}
