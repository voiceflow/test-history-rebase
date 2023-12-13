import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, CardAttachmentORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class CardAttachmentService extends CMSObjectService<CardAttachmentORM> {
  constructor(
    @Inject(CardAttachmentORM)
    protected readonly orm: CardAttachmentORM,
    @Inject(MediaAttachmentORM)
    protected readonly mediaORM: MediaAttachmentORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM
  ) {
    super();
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.deleteManyByEnvironment(assistant, environmentID);
  }
}
