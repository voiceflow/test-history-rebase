import type { Markup, ObjectResource } from '@/common';

import type { ConditionOperation } from '../condition-operation.enum';

export interface ConditionAssertion extends ObjectResource {
  operation: ConditionOperation;
  lhs: Markup;
  rhs: Markup;
  conditionID: string;
  assistantID: string;
}
