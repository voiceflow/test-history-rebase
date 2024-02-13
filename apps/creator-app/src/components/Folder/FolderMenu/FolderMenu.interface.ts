import type { Folder, FolderScope } from '@voiceflow/dtos';

export interface IFolderMenu {
  width?: number;
  scope: FolderScope;
  onClose: VoidFunction;
  parentID: string | null;
  onSelect: (folder: Folder | null) => void;
  excludeIDs?: string[];
}

export interface IFolderMenuItem {
  index: number;
  scope: FolderScope;
  folder: Folder;
  onClick: VoidFunction;
  searchValue: string;
}

export interface IFolderMenuRootItem {
  name: string;
  index: number;
  scope: FolderScope;
  isLast: boolean;
  onClick: VoidFunction;
  searchValue: string;
}
