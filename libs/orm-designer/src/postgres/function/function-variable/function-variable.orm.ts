import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectORM } from '@/postgres/common/postgres-cms-object.orm';
import type { PKOrEntity } from '@/types';

import type { FunctionEntity } from '../function.entity';
import { FunctionVariableEntity } from './function-variable.entity';

export class FunctionVariableORM extends PostgresCMSObjectORM(FunctionVariableEntity) {
  findManyByFunctions(functions: PKOrEntity<FunctionEntity>[]) {
    return this.find({ function: functions });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }
}
