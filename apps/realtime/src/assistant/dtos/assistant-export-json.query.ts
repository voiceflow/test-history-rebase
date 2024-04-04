import { z } from 'zod';

export const AssistantExportJSONQuery = z.object({
  programs: z.boolean().optional(),
  prototype: z.boolean().optional(),
  centerDiagrams: z.boolean().optional().default(true),
  prototypePrograms: z.boolean().optional(),
});

export type AssistantExportJSONQuery = z.infer<typeof AssistantExportJSONQuery>;
