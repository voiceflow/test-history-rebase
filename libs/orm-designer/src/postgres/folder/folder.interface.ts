import type { ToJSON, ToObject } from '@/types';

import type { FolderEntity } from './folder.entity';

export type FolderObject = ToObject<FolderEntity>;
export type FolderJSON = ToJSON<FolderObject>;
