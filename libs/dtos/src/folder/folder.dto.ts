import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FolderScope } from './folder-scope.enum';

export const FolderDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    name: z.string().min(1, 'Name is required.').max(255, 'Name is too long.'),
    scope: z.nativeEnum(FolderScope),
    parentID: z.string().nullable(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type Folder = z.infer<typeof FolderDTO>;
