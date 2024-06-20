import { Module } from '@nestjs/common';
import { EntityORM, IntentORM, RequiredEntityORM } from '@voiceflow/orm-designer';

import { ReferenceModule } from '@/reference/reference.module';
import { ResponseModule } from '@/response/response.module';

import { RequiredEntityLoguxController } from './required-entity.logux.controller';
import { RequiredEntityService } from './required-entity.service';

@Module({
  imports: [ResponseModule, ReferenceModule],
  exports: [RequiredEntityService],
  providers: [IntentORM, EntityORM, RequiredEntityORM, RequiredEntityService],
  controllers: [RequiredEntityLoguxController],
})
export class RequiredEntityModule {}
