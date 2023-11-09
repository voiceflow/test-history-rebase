import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

import { FolderScope } from './folder-scope.enum';

export const FolderDTO = CMSObjectResourceDTO.extend({
  name: z.string(),
  scope: z.nativeEnum(FolderScope),
  parentID: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type Folder = z.infer<typeof FolderDTO>;
