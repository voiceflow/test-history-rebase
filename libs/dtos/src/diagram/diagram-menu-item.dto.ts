import { z } from 'zod';

/**
 * @deprecated not used anymore
 */
export const DiagramMenuItemDTO = z
  .object({
    type: z.string(),
    sourceID: z.string(),
  })
  .strict();

/**
 * @deprecated not used anymore
 */
export type DiagramMenuItem = z.infer<typeof DiagramMenuItemDTO>;
