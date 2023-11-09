import { z } from 'zod';

import { CMSBaseResourceDTO } from './cms-base-resource.dto';

export const CMSCreatableResourceDTO = CMSBaseResourceDTO.extend({
  createdAt: z.string().datetime(),
}).strict();

export type CMSCreatableResource = z.infer<typeof CMSCreatableResourceDTO>;
