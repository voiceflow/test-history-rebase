import type { PKOrEntity } from '@/types';

import type { AssistantEntity } from '../assistant';
import { PostgresCMSTabularORM } from '../common';
import { ResponseEntity } from './response.entity';

export class ResponseORM extends PostgresCMSTabularORM(ResponseEntity) {
  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.nativeDelete({ assistant, environmentID });
  }
}
