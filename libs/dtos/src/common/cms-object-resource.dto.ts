import { z } from 'zod';

import { CMSCreatableResourceDTO } from './cms-creatable-resource.dto';

export const CMSObjectResourceDTO = CMSCreatableResourceDTO.extend({
  updatedAt: z.string().datetime(),
}).strict();

export type CMSObjectResource = z.infer<typeof CMSObjectResourceDTO>;
