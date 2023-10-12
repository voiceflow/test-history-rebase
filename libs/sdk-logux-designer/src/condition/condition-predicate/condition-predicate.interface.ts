import type { Markup, ObjectResource } from '@/common';

import type { ConditionOperation } from '../condition-operation.enum';

export interface ConditionPredicate extends ObjectResource {
  operation: ConditionOperation;
  rhs: Markup;
  conditionID: string;
  assistantID: string;
}
