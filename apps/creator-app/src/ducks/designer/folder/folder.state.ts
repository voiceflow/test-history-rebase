import type { Folder } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'folder';

export interface FolderState extends Normalized<Folder> {}
