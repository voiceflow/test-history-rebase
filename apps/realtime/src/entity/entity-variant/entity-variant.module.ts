import { Module } from '@nestjs/common';
import { AssistantORM, EntityORM, EntityVariantORM } from '@voiceflow/orm-designer';

import { EntityVariantService } from './entity-variant.service';

@Module({
  imports: [EntityVariantORM.register(), EntityORM.register(), AssistantORM.register()],
  providers: [EntityVariantService],
  exports: [EntityVariantService],
})
export class EntityVariantModule {}
