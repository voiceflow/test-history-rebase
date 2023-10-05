import { Module } from '@nestjs/common';
import { AssistantORM, EventORM, EventTriggerORM, IntentORM, IntentTriggerORM, StoryORM, TriggerORM } from '@voiceflow/orm-designer';

import { EventTriggerService } from './event-trigger.service';
import { IntentTriggerService } from './intent-trigger.service';
import { TriggerLoguxController } from './trigger.logux.controller';
import { TriggerService } from './trigger.service';

@Module({
  imports: [
    EventORM.register(),
    StoryORM.register(),
    IntentORM.register(),
    TriggerORM.register(),
    AssistantORM.register(),
    EventTriggerORM.register(),
    IntentTriggerORM.register(),
  ],
  exports: [TriggerService, EventTriggerService, IntentTriggerService],
  providers: [TriggerService, EventTriggerService, IntentTriggerService],
  controllers: [TriggerLoguxController],
})
export class TriggerModule {}
