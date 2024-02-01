import { z } from 'zod';

import { CMSObjectResourceDTO, Language } from '@/common';

export const EntityVariantDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    value: z.string(),
    language: z.nativeEnum(Language),
    synonyms: z.array(z.string()),
    entityID: z.string(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type EntityVariant = z.infer<typeof EntityVariantDTO>;
