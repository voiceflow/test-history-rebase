import type { PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import { PostgresCMSTabularORM } from '../common';
import { ResponseEntity } from './response.entity';

export class ResponseORM extends PostgresCMSTabularORM(ResponseEntity) {
  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em.createQueryBuilder(ResponseEntity).update({ deletedAt: new Date() }).where({ assistant }).execute();
  }
}
