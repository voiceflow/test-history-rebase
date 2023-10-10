import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, CardAttachmentORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class CardAttachmentService extends MutableService<CardAttachmentORM> {
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

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.deleteManyByAssistant(assistant);
  }
}
