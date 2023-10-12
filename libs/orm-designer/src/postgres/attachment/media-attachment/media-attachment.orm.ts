import type { AssistantEntity } from '@/main';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import { MediaAttachmentEntity } from './media-attachment.entity';

export class MediaAttachmentORM extends PostgresCMSMutableORM(MediaAttachmentEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(MediaAttachmentEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}
