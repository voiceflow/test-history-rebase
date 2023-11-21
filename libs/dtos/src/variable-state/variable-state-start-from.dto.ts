import { z } from 'zod';

export const VariableStateStartFromDTO = z
  .object({
    stepID: z.string(),
    diagramID: z.string(),
  })
  .strict();

export type VariableStateStartFrom = z.infer<typeof VariableStateStartFromDTO>;
