import { z } from 'zod';

export const ProgramLineDTO = z
  .object({
    id: z.string(),
    type: z.string(),
  })
  .passthrough();

export type ProgramLine = z.infer<typeof ProgramLineDTO>;
