import { Module } from '@nestjs/common';
import { ProjectORM, ReferenceORM, ReferenceResourceORM } from '@voiceflow/orm-designer';

import { IntentModule } from '@/intent/intent.module';

import { ReferenceLoguxController } from './reference.logux.controller';
import { ReferenceService } from './reference.service';
import { ReferenceCacheService } from './reference-cache.service';

@Module({
  imports: [IntentModule],
  exports: [ReferenceService],
  providers: [ReferenceORM, ProjectORM, ReferenceResourceORM, ReferenceService, ReferenceCacheService],
  controllers: [ReferenceLoguxController],
})
export class ReferenceModule {}
