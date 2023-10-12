import type { AssistantEntity } from '@/main';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';
import { CardButtonEntity } from './card-button.entity';

export class CardButtonORM extends PostgresCMSMutableORM(CardButtonEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID });
  }

  findManyByCardAttachments(cards: PKOrEntity<CardAttachmentEntity>[]) {
    return this.find({ card: cards });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(CardButtonEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}
