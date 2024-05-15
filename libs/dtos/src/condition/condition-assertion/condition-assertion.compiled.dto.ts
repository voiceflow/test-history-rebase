import { z } from 'zod';

import { ConditionOperation } from '../condition-operation.enum';

export const CompiledConditionAssertionDTO = z.object({
  lhs: z.string(),
  rhs: z.string(),
  operation: z.nativeEnum(ConditionOperation),
}).strict();

export type CompiledConditionAssertion = z.infer<typeof CompiledConditionAssertionDTO>;
