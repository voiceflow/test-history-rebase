import { z } from 'zod';

import { ConditionOperation } from '../condition-operation.enum';

export const CompiledConditionPredicateDTO = z.object({
  rhs: z.string(),
  operation: z.nativeEnum(ConditionOperation),
}).strict();

export type CompiledConditionPredicate = z.infer<typeof CompiledConditionPredicateDTO>;
