import { Module } from '@nestjs/common';
import { AssistantORM, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';

import { EntityVariantLoguxController } from './entity-variant.logux.controller';
import { EntityVariantService } from './entity-variant.service';

@Module({
  imports: [EntityVariantORM.register(), EntityORM.register(), AssistantORM.register()],
  exports: [EntityVariantService],
  providers: [EntityVariantService],
  controllers: [EntityVariantLoguxController],
})
export class EntityVariantModule {}
