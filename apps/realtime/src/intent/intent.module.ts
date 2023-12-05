import { Module } from '@nestjs/common';
import { IntentORM } from '@voiceflow/orm-designer';

import { EntityModule } from '@/entity/entity.module';
import { ResponseModule } from '@/response/response.module';
import { TriggerModule } from '@/story/trigger/trigger.module';

import { IntentLoguxController } from './intent.logux.controller';
import { IntentService } from './intent.service';
import { RequiredEntityModule } from './required-entity/required-entity.module';
import { UtteranceModule } from './utterance/utterance.module';

@Module({
  imports: [IntentORM.register(), EntityModule, TriggerModule, ResponseModule, UtteranceModule, RequiredEntityModule],
  exports: [IntentService],
  providers: [IntentService],
  controllers: [IntentLoguxController],
})
export class IntentModule {}
