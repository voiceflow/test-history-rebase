import { z } from 'zod';

export const ThreadDTO = z
  .object({
    id: z.string(),
    nodeID: z.string().nullable(),
    resolved: z.boolean(),
    position: z.tuple([z.number(), z.number()]),
    projectID: z.string(),
    diagramID: z.string(),
  })
  .strict();

export type Thread = z.infer<typeof ThreadDTO>;
