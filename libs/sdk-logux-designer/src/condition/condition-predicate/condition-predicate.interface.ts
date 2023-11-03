import type { Markup, ObjectResource } from '@/common';

import type { ConditionOperation } from '../condition-operation.enum';

export interface ConditionPredicate extends ObjectResource {
  rhs: Markup;
  operation: ConditionOperation;
  conditionID: string;
  assistantID: string;
  environmentID: string;
}
