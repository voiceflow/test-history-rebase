import type { Markup, ObjectResource } from '@/common';

import type { ConditionOperation } from '../condition-operation.enum';

export interface ConditionAssertion extends ObjectResource {
  lhs: Markup;
  rhs: Markup;
  operation: ConditionOperation;
  conditionID: string;
  assistantID: string;
  environmentID: string;
}
