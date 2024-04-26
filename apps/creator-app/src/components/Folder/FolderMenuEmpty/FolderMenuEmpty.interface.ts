import type { Folder, FolderScope } from '@voiceflow/dtos';

export interface IFolderMenuEmpty {
  width?: number;
  scope: FolderScope;
  parentID: string | null;
  onCreated?: (folder: Folder) => void;
}
