import { z } from 'zod';

export const AssistantExportJSONQuery = z.object({
  programs: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  prototype: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  centerDiagrams: z
    .string()
    .optional()
    .default('true')
    .transform((value) => value === 'true'),
  prototypePrograms: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

export type AssistantExportJSONQuery = z.infer<typeof AssistantExportJSONQuery>;
