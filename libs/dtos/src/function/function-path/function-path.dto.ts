import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const FunctionPathDTO = CMSObjectResourceDTO.extend({
  name: z.string(),
  label: z.string().nullable(),
  functionID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type FunctionPath = z.infer<typeof FunctionPathDTO>;
