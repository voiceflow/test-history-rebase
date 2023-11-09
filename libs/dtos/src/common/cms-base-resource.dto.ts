import { z } from 'zod';

export const CMSBaseResourceDTO = z
  .object({
    id: z.string(),
  })
  .strict();

export type CMSBaseResource = z.infer<typeof CMSBaseResourceDTO>;
