import { z } from 'zod';

import { VariableStateStartFromDTO } from './variable-state-start-from.dto';

export const VariableStateDTO = z
  .object({
    _id: z.string(),
    name: z.string(),
    projectID: z.string(),
    variables: z.record(z.any()),
    startFrom: VariableStateStartFromDTO.nullable().optional(),
  })
  .strict();

export type VariableState = z.infer<typeof VariableStateStartFromDTO>;
