import { Module } from '@nestjs/common';
import { EntityORM } from '@voiceflow/orm-designer';

import { RequiredEntityModule } from '@/intent/required-entity/required-entity.module';

import { EntityLoguxController } from './entity.logux.controller';
import { EntityService } from './entity.service';
import { EntityVariantModule } from './entity-variant/entity-variant.module';

@Module({
  imports: [EntityVariantModule, RequiredEntityModule],
  exports: [EntityService],
  providers: [EntityORM, EntityService],
  controllers: [EntityLoguxController],
})
export class EntityModule {}
