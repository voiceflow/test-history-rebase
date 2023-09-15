import { Module } from '@nestjs/common';

// import { EntityORM } from '@voiceflow/orm-designer';
import { EntityService } from './entity.service';

@Module({
  // imports: [EntityORM.register()],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
