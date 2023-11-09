import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

import { ConditionOperation } from '../condition-operation.enum';

export const ConditionAssertionDTO = CMSObjectResourceDTO.extend({
  lhs: MarkupDTO,
  rhs: MarkupDTO,
  operation: z.nativeEnum(ConditionOperation),
  conditionID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type ConditionAssertion = z.infer<typeof ConditionAssertionDTO>;
