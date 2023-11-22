import { z } from 'zod';

export const ProjectAIAssistSettingsDTO = z
  .object({
    aiPlayground: z.boolean().optional(),
    generateStep: z.boolean().optional(),
    generativeTasks: z.boolean().optional(),
    generateNoMatch: z.boolean().optional(),
  })
  .nonstrict();

export type ProjectAIAssistSettings = z.infer<typeof ProjectAIAssistSettingsDTO>;
