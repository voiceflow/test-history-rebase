import { Module } from '@nestjs/common';
import { EntityORM, IntentORM, RequiredEntityORM } from '@voiceflow/orm-designer';

import { RequiredEntityLoguxController } from './required-entity.logux.controller';
import { RequiredEntityService } from './required-entity.service';

@Module({
  imports: [IntentORM.register(), EntityORM.register(), RequiredEntityORM.register()],
  exports: [RequiredEntityService],
  providers: [RequiredEntityService],
  controllers: [RequiredEntityLoguxController],
})
export class RequiredEntityModule {}
