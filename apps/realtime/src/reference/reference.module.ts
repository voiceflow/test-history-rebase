import { Module } from '@nestjs/common';
import {
  DiagramORM,
  FunctionORM,
  IntentORM,
  ProjectORM,
  ReferenceORM,
  ReferenceResourceORM,
  ResponseORM,
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
    ResponseORM,
    ReferenceORM,
    ReferenceResourceORM,
    ReferenceService,
    ReferenceCacheService,
  ],
  controllers: [ReferenceLoguxController],
})
export class ReferenceModule {}
