import { z } from 'zod';

export const DiagramNodeDTO = z
  .object({
    type: z.string(),
    data: z.record(z.any()),
    nodeID: z.string(),
    coords: z.tuple([z.number(), z.number()]).optional(),
  })
  .strict();

export type DiagramNode = z.infer<typeof DiagramNodeDTO>;
