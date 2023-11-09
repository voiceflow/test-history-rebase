import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const ConditionPredicateDTO = CMSObjectResourceDTO.extend({
  rhs: MarkupDTO,
  operation: z.nativeEnum(ConditionOperation),
  conditionID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type ConditionPredicate = z.infer<typeof ConditionPredicateDTO>;
