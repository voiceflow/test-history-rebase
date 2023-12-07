import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { EntityEntity } from '@/postgres/entity';
import type { ResponseEntity } from '@/postgres/response';
import type { PKOrEntity } from '@/types';

import type { IntentEntity } from '../intent.entity';
import { RequiredEntityEntity } from './required-entity.entity';

export class RequiredEntityORM extends PostgresCMSObjectORM(RequiredEntityEntity) {
  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.find({ intent: intents });
  }

  findManyByEntities(entities: PKOrEntity<EntityEntity>[]) {
    return this.find({ entity: entities });
  }

  findManyByReprompts(reprompts: PKOrEntity<ResponseEntity>[]) {
    return this.find({ reprompt: reprompts });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
