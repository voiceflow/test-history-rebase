import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class MediaAttachmentService extends MutableService<MediaAttachmentORM> {
  constructor(
    @Inject(MediaAttachmentORM)
    protected readonly orm: MediaAttachmentORM,
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
