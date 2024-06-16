import { Module } from '@nestjs/common';
import { ReferenceORM, ReferenceResourceORM } from '@voiceflow/orm-designer';

import { ReferenceLoguxController } from './reference.logux.controller';
import { ReferenceService } from './reference.service';
import { ReferenceCacheService } from './reference-cache.service';

@Module({
  exports: [ReferenceService],
  providers: [ReferenceORM, ReferenceResourceORM, ReferenceService, ReferenceCacheService],
  controllers: [ReferenceLoguxController],
})
export class ReferenceModule {}
