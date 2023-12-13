import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { ResponseEntity } from '../response.entity';
import { ResponseDiscriminatorEntity } from './response-discriminator.entity';

export class ResponseDiscriminatorORM extends PostgresCMSObjectORM(ResponseDiscriminatorEntity) {
  findManyByResponses(responses: PKOrEntity<ResponseEntity>[]) {
    return this.find({ response: responses });
  }

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
