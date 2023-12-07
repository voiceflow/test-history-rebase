import type { EntityDTO } from '@mikro-orm/core';

import { ConditionOperation } from '../condition-operation.enum';
import type { ConditionAssertionEntity } from './condition-assertion.entity';

export const conditionAssertion: EntityDTO<ConditionAssertionEntity> = {
  id: 'condition-assertion-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  operation: ConditionOperation.IS,
  updatedByID: 1,
  lhs: ['123'],
  rhs: [{ variableID: 'variable-1' }],
  condition: { id: 'condition-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const conditionAssertionList: EntityDTO<ConditionAssertionEntity>[] = [
  conditionAssertion,
  {
    ...conditionAssertion,
    id: 'condition-assertion-2',
  },
];
