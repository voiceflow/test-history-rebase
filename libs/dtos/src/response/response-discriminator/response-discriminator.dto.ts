import { z } from 'zod';

import { Channel, CMSObjectResourceDTO, Language } from '@/common';

export const ResponseDiscriminatorDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    channel: z.nativeEnum(Channel),
    language: z.nativeEnum(Language),
    responseID: z.string(),
    assistantID: z.string().optional(),
    variantOrder: z.array(z.string()),
    environmentID: z.string().optional(),
  })
  .strict();

export type ResponseDiscriminator = z.infer<typeof ResponseDiscriminatorDTO>;
