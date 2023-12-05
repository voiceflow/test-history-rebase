import { Module } from '@nestjs/common';
import { StoryORM } from '@voiceflow/orm-designer';

import { StoryLoguxController } from './story.logux.controller';
import { StoryService } from './story.service';
import { TriggerModule } from './trigger/trigger.module';

@Module({
  imports: [StoryORM.register(), TriggerModule],
  exports: [StoryService],
  providers: [StoryService],
  controllers: [StoryLoguxController],
})
export class StoryModule {}
