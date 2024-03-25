import { Module } from '@nestjs/common';
import { AssistantORM, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';

import { EntityVariantLoguxController } from './entity-variant.logux.controller';
import { EntityVariantService } from './entity-variant.service';

@Module({
  exports: [EntityVariantService],
  providers: [EntityVariantORM, EntityORM, AssistantORM, EntityVariantService],
  controllers: [EntityVariantLoguxController],
})
export class EntityVariantModule {}
