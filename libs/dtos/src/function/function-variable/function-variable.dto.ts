import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FunctionVariableType } from './function-variable-type.enum';

export const FunctionVariableDTO = CMSObjectResourceDTO.extend({
  name: z.string(),
  type: z.nativeEnum(FunctionVariableType),
  functionID: z.string(),
  description: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type FunctionVariable = z.infer<typeof FunctionVariableDTO>;
