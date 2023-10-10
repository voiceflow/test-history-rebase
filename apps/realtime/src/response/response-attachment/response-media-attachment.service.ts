import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, MediaAttachmentEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { ResponseMediaAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseMediaAttachmentService extends MutableService<ResponseMediaAttachmentORM> {
  constructor(
    @Inject(ResponseMediaAttachmentORM)
    protected readonly orm: ResponseMediaAttachmentORM
  ) {
    super();
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByAssistant(assistant, environmentID);
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.orm.deleteManyByAssistant(assistant);
  }

  findManyByMediaAttachments(medias: PKOrEntity<MediaAttachmentEntity>[]) {
    return this.orm.findManyByMediaAttachments(medias);
  }
}
