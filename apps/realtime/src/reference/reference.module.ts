import { Module } from '@nestjs/common';
import {
  DiagramORM,
  FunctionORM,
  IntentORM,
  ProjectORM,
  ReferenceORM,
  ReferenceResourceORM,
} from '@voiceflow/orm-designer';

import { ReferenceLoguxController } from './reference.logux.controller';
import { ReferenceService } from './reference.service';
import { ReferenceCacheService } from './reference-cache.service';

@Module({
  exports: [ReferenceService],
  providers: [
    IntentORM,
    DiagramORM,
    ProjectORM,
    FunctionORM,
    ReferenceORM,
    ReferenceResourceORM,
    ReferenceService,
    ReferenceCacheService,
  ],
  controllers: [ReferenceLoguxController],
})
export class ReferenceModule {}
