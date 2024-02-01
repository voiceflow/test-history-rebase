import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const ConditionPredicateDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    rhs: MarkupDTO,
    operation: z.nativeEnum(ConditionOperation),
    conditionID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type ConditionPredicate = z.infer<typeof ConditionPredicateDTO>;
