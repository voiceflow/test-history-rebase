import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './file.module-definition';
import { FileService } from './file.service';

@Global()
@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule extends ConfigurableModuleClass {}
