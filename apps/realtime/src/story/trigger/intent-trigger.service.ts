import { Inject, Injectable } from '@nestjs/common';
import { AssistantORM, IntentORM, IntentTriggerORM, StoryORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class IntentTriggerService extends CMSObjectService<IntentTriggerORM> {
  constructor(
    @Inject(IntentTriggerORM)
    protected readonly orm: IntentTriggerORM,
    @Inject(StoryORM)
    protected readonly storyORM: StoryORM,
    @Inject(IntentORM)
    protected readonly intentORM: IntentORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }
}
