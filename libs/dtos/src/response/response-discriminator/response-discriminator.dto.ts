import { z } from 'zod';

import { Channel, CMSObjectResourceDTO, Language } from '@/common';

export const ResponseDiscriminatorDTO = CMSObjectResourceDTO.extend({
  channel: z.nativeEnum(Channel),
  language: z.nativeEnum(Language),
  responseID: z.string(),
  assistantID: z.string(),
  variantOrder: z.array(z.string()),
  environmentID: z.string(),
}).strict();

export type ResponseDiscriminator = z.infer<typeof ResponseDiscriminatorDTO>;
