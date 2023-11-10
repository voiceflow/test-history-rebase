import { z } from 'zod';

export const DiagramMenuItemDTO = z
  .object({
    type: z.string(),
    sourceID: z.string(),
  })
  .strict();

export type DiagramMenuItem = z.infer<typeof DiagramMenuItemDTO>;
