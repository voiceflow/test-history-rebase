import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { FunctionEntity } from '../function.entity';
import { FunctionPathEntity } from './function-path.entity';

export class FunctionPathORM extends PostgresCMSMutableORM(FunctionPathEntity) {
  findManyByFunctions(functions: PKOrEntity<FunctionEntity>[]) {
    return this.find({ function: functions });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
