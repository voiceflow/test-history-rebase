import { z } from 'zod';

export const ProgramCommandDTO = z
  .object({
    type: z.string(),
  })
  .nonstrict();

export type ProgramCommand = z.infer<typeof ProgramCommandDTO>;
