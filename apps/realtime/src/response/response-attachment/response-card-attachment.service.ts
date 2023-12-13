import { Inject, Injectable } from '@nestjs/common';
import type { AssistantEntity, CardAttachmentEntity, PKOrEntity } from '@voiceflow/orm-designer';
import { ResponseCardAttachmentORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ResponseCardAttachmentService extends MutableService<ResponseCardAttachmentORM> {
  constructor(
    @Inject(ResponseCardAttachmentORM)
    protected readonly orm: ResponseCardAttachmentORM
  ) {
    super();
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyByCardAttachments(cards: PKOrEntity<CardAttachmentEntity>[]) {
    return this.orm.findManyByCardAttachments(cards);
  }
}
