export enum FolderItemType {
  FOLDER = 'FOLDER',
  DIAGRAM = 'DIAGRAM',
}
export interface FolderItem {
  type: FolderItemType;
  sourceID: string;
}
export interface Folder {
  id: string;
  name: string;
  items: FolderItem[];
}
