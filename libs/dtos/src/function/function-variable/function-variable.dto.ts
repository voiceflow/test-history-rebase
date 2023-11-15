import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FunctionVariableKind } from './function-variable-kind.enum';

export const FunctionVariableDTO = CMSObjectResourceDTO.extend({
  name: z.string(),
  type: z.nativeEnum(FunctionVariableKind),
  functionID: z.string(),
  description: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type FunctionVariable = z.infer<typeof FunctionVariableDTO>;
