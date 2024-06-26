import type { EntityDTO } from '@mikro-orm/core';
import { ConditionOperation } from '@voiceflow/dtos';

import type { ConditionPredicateEntity } from './condition-predicate.entity';

export const conditionPredicate: EntityDTO<ConditionPredicateEntity> = {
  id: 'condition-predicate-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  operation: ConditionOperation.IS_NOT,
  rhs: [{ variableID: 'variable-1' }],
  condition: { id: 'condition-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const conditionPredicateList: EntityDTO<ConditionPredicateEntity>[] = [
  conditionPredicate,
  {
    ...conditionPredicate,
    id: 'condition-predicate-2',
  },
];
