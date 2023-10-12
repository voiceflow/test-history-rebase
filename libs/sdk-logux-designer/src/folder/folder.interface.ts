import type { ObjectResource } from '@/common';

import type { FolderScope } from './folder-scope.enum';

export interface Folder extends ObjectResource {
  name: string;
  scope: FolderScope;
  parentID: string | null;
  assistantID: string;
}
