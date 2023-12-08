import { z } from 'zod';

import { CMSObjectResourceDTO } from './cms-object-resource.dto';

export const CMSTabularResourceDTO = CMSObjectResourceDTO.extend({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  folderID: z.string().nullable(),
  assistantID: z.string(),
  createdByID: z.number(),
  updatedByID: z.number(),
  environmentID: z.string(),
}).strict();

export type CMSTabularResource = z.infer<typeof CMSTabularResourceDTO>;
