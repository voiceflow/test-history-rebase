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

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyByMediaAttachments(medias: PKOrEntity<MediaAttachmentEntity>[]) {
    return this.orm.findManyByMediaAttachments(medias);
  }
}
