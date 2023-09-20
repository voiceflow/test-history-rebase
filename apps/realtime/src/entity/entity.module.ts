import { Module } from '@nestjs/common';
import { AssistantORM, EntityORM, FolderORM } from '@voiceflow/orm-designer';

import { EntityService } from './entity.service';

@Module({
  imports: [AssistantORM.register(), FolderORM.register(), EntityORM.register()],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
