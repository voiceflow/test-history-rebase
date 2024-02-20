import { z } from 'zod';

import { CMSObjectResourceDTO } from './cms-object-resource.dto';

export const CMSTabularResourceDTO = CMSObjectResourceDTO.extend({
  name: z.string().max(255, 'Name is too long.'),
  folderID: z.string().nullable(),
  createdByID: z.number(),
  updatedByID: z.number(),
  assistantID: z.string().optional(),
  environmentID: z.string().optional(),
}).strict();

export type CMSTabularResource = z.infer<typeof CMSTabularResourceDTO>;
