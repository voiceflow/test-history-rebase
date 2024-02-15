import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { IntentEntity } from '../intent.entity';
import { UtteranceEntity } from './utterance.entity';

export class UtteranceORM extends PostgresCMSObjectORM(UtteranceEntity) {
  findManyByIntents(intents: PKOrEntity<IntentEntity>[]) {
    return this.find({ intent: intents });
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
