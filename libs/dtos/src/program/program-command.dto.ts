import { z } from 'zod';

export const ProgramCommandDTO = z
  .object({
    type: z.string(),
  })
  .passthrough();

export type ProgramCommand = z.infer<typeof ProgramCommandDTO>;
