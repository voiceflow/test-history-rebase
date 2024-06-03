import { z } from 'zod';

import { MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const ConditionAssertionDTO = z
  .object({
    lhs: MarkupDTO,
    rhs: MarkupDTO,
    operation: z.nativeEnum(ConditionOperation),
  })
  .strict();

export type ConditionAssertion = z.infer<typeof ConditionAssertionDTO>;
