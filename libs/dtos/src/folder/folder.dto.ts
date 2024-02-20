import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FolderScope } from './folder-scope.enum';

export const FolderDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().max(255, 'Name is too long.'),
    scope: z.nativeEnum(FolderScope),
    parentID: z.string().nullable(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type Folder = z.infer<typeof FolderDTO>;
