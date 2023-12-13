import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, MediaAttachmentORM } from '@voiceflow/orm-designer';

import { CMSObjectService } from '@/common';

@Injectable()
export class MediaAttachmentService extends CMSObjectService<MediaAttachmentORM> {
  constructor(
    @Inject(MediaAttachmentORM)
    protected readonly orm: MediaAttachmentORM,
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
