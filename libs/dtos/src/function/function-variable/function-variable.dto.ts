import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FunctionVariableKind } from './function-variable-kind.enum';

export const FunctionVariableDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().max(255, 'Name is too long.'),
    type: z.nativeEnum(FunctionVariableKind),
    functionID: z.string(),
    description: z.string().nullable(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type FunctionVariable = z.infer<typeof FunctionVariableDTO>;
