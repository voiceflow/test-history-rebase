import type { AssistantEntity } from '@/main';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import { CardAttachmentEntity } from './card-attachment.entity';

export class CardAttachmentORM extends PostgresCMSObjectORM(CardAttachmentEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }
}
