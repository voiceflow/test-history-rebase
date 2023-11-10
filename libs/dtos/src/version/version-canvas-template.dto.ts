import { z } from 'zod';

export const VersionCanvasTemplateDTO = z
  .object({
    id: z.string(),
    name: z.string(),
    color: z.string().nullable(),
    nodeIDs: z.array(z.string()),
  })
  .strict();

export type VersionCanvasTemplate = z.infer<typeof VersionCanvasTemplateDTO>;
