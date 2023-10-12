import type { AssistantEntity } from '@/main';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import { CardAttachmentEntity } from './card-attachment.entity';

export class CardAttachmentORM extends PostgresCMSMutableORM(CardAttachmentEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(CardAttachmentEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}
