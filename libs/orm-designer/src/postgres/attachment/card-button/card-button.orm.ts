import type { AssistantEntity } from '@/main';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';
import { CardButtonEntity } from './card-button.entity';

export class CardButtonORM extends PostgresCMSObjectORM(CardButtonEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }

  findManyByCardAttachments(cards: PKOrEntity<CardAttachmentEntity>[]) {
    return this.find({ card: cards });
  }
}
