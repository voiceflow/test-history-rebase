import type { EntityDTO } from '@mikro-orm/core';
import { FolderScope } from '@voiceflow/dtos';

import type { FolderEntity } from './folder.entity';

export const folder: EntityDTO<FolderEntity> = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  name: 'first folder',
  parent: null,
  scope: FolderScope.PERSONA,
  assistant: { id: 'assistant-id' } as any,
  environmentID: 'environment-id',
};

export const folderList: EntityDTO<FolderEntity>[] = [
  folder,
  {
    ...folder,
    id: '2',
    name: 'second folder',
    parent: { id: folder.id } as any,
    scope: FolderScope.VARIABLE,
  },
];
