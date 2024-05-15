import { z } from 'zod';

export const CompiledCardButtonDTO = z.object({
  label: z.string(),
}).strict();

export type CompiledCardButton = z.infer<typeof CompiledCardButtonDTO>;
