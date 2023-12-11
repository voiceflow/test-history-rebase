import { Module } from '@nestjs/common';
import { EntityORM, IntentORM, RequiredEntityORM } from '@voiceflow/orm-designer';

import { ResponseModule } from '@/response/response.module';

import { RequiredEntityLoguxController } from './required-entity.logux.controller';
import { RequiredEntityService } from './required-entity.service';

@Module({
  imports: [IntentORM.register(), EntityORM.register(), RequiredEntityORM.register(), ResponseModule],
  exports: [RequiredEntityService],
  providers: [RequiredEntityService],
  controllers: [RequiredEntityLoguxController],
})
export class RequiredEntityModule {}
