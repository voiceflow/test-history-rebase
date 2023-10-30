export interface VersionFolderItem {
  type: string;
  sourceID: string;
}

export interface VersionFolder {
  id: string;
  name: string;
  items: VersionFolderItem[];
}
