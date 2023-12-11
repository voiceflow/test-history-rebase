import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

export const IntentDTO = CMSTabularResourceDTO.extend({
  description: z.string().nullable(),
  entityOrder: z.array(z.string()),
  automaticReprompt: z.boolean(),
});

export type Intent = z.infer<typeof IntentDTO>;
