import { Module } from '@nestjs/common';
import { AssistantORM, EntityORM, FolderORM } from '@voiceflow/orm-designer';

import { EntityService } from './entity.service';
import { EntityVariantModule } from './entity-variant/entity-variant.module';

@Module({
  imports: [FolderORM.register(), AssistantORM.register(), EntityORM.register(), EntityVariantModule],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
