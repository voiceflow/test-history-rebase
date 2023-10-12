import type { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSMutableORM } from '@/postgres/common/postgres-cms-mutable.orm';
import type { PKOrEntity } from '@/types';

import type { FunctionEntity } from '../function.entity';
import { FunctionVariableEntity } from './function-variable.entity';

export class FunctionVariableORM extends PostgresCMSMutableORM(FunctionVariableEntity) {
  findManyByFunctions(functions: PKOrEntity<FunctionEntity>[]) {
    return this.find({ function: functions });
  }

  findManyByAssistant(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.find({ assistant, environmentID }, { orderBy: { createdAt: 'DESC' } });
  }

  deleteManyByAssistant(assistant: PKOrEntity<AssistantEntity>) {
    return this.em
      .createQueryBuilder(FunctionVariableEntity)
      .update({ deletedAt: new Date() })
      .where({ assistant })
      .execute();
  }
}
