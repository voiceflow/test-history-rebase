import { z } from 'zod';

export const ProjectAIAssistSettingsDTO = z
  .object({
    aiPlayground: z.boolean().optional(),
    generateNoMatch: z.boolean().optional(),
  })
  .nonstrict();

export type ProjectAIAssistSettingsDTO = z.infer<typeof ProjectAIAssistSettingsDTO>;
