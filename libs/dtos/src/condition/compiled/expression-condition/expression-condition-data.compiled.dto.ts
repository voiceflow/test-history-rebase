import { z } from 'zod';

import { CompiledConditionAssertionDTO } from '@/condition/condition-assertion/condition-assertion.compiled.dto';

export const CompiledExpressionConditionDataDTO = z.object({
  matchAll: z.boolean(),
  assertions: z.array(CompiledConditionAssertionDTO)
});

export type CompiledExpressionConditionData = z.infer<typeof CompiledExpressionConditionDataDTO>;
