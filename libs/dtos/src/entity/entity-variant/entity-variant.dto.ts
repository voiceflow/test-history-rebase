import { z } from 'zod';

import { CMSObjectResourceDTO, Language } from '@/common';

export const EntityVariantDTO = CMSObjectResourceDTO.extend({
  value: z.string(),
  language: z.nativeEnum(Language),
  synonyms: z.array(z.string()),
  entityID: z.string(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type EntityVariant = z.infer<typeof EntityVariantDTO>;
