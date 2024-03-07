import { z } from 'zod';

export const ProjectNLUSettingsDTO = z
  .object({
    classifyStrategy: z.string().optional(),
  })
  .passthrough();

export type ProjectNLUSettings = z.infer<typeof ProjectNLUSettingsDTO>;
