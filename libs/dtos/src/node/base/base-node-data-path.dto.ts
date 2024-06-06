import { z } from 'zod';

export const BaseNodeDataPathDTO = z
  .object({
    path: z.boolean().nullable().optional(),
    pathLabel: z.string().nullable().optional(),
  })
  .strict();

export type BaseNodeDataPath = z.infer<typeof BaseNodeDataPathDTO>;
