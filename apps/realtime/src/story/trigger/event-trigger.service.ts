import { Inject, Injectable } from '@nestjs/common';
import { AssistantORM, EventORM, EventTriggerORM, StoryORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class EventTriggerService extends MutableService<EventTriggerORM> {
  constructor(
    @Inject(EventTriggerORM)
    protected readonly orm: EventTriggerORM,
    @Inject(StoryORM)
    protected readonly storyORM: StoryORM,
    @Inject(EventORM)
    protected readonly eventORM: EventORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }
}
