import { FolderScope } from '@voiceflow/dtos';
import type { Atom } from 'jotai';

export interface CMSRouteFolder {
  id: string;
  name: string;
  pathname: string;
}

export interface ICMSRouteFolders {
  folders: Atom<CMSRouteFolder[]>;
  rootPathname: Atom<string>;
  activeFolderID: Atom<null | string>;
  activeFolderScope: Atom<FolderScope>;
  activeFolderPathname: Atom<string>;
}

export interface ICMSRouteFoldersScope {
  folders: Atom<CMSRouteFolder[]>;
  pathname: string;
  folderID: null | string;
  folderScope: FolderScope;
}

export interface ICMSRouteFoldersProvider {
  pathname: string;
  Component: React.FC;
  folderScope: FolderScope;
}
