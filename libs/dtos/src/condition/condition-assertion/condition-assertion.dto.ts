import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const ConditionAssertionDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    lhs: MarkupDTO,
    rhs: MarkupDTO,
    operation: z.nativeEnum(ConditionOperation),
    conditionID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type ConditionAssertion = z.infer<typeof ConditionAssertionDTO>;
