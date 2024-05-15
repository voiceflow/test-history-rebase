import { z } from 'zod';

import { MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const CompiledConditionPredicateDTO = z.object({
  rhs: MarkupDTO,
  operation: z.nativeEnum(ConditionOperation),
}).strict();

export type CompiledConditionPredicate = z.infer<typeof CompiledConditionPredicateDTO>;
