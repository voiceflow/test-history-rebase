import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FunctionVariableKind } from './function-variable-kind.enum';

export const FunctionVariableDTO = CMSObjectResourceDTO.extend({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  type: z.nativeEnum(FunctionVariableKind),
  functionID: z.string(),
  description: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type FunctionVariable = z.infer<typeof FunctionVariableDTO>;
