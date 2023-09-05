import type { Atom } from 'jotai';

import type { State as AppState } from '@/ducks';

export interface CMSRouteFolder {
  id: string;
  url: string;
  name: string;
  count: number;
}

type CountSelector = (state: AppState, params: { folderID: string | null }) => number;

export interface ICMSRouteFolders {
  folders: Atom<CMSRouteFolder[]>;
  activeFolderID: Atom<null | string>;
  activeFolderURL: Atom<null | string>;
}

export interface ICMSRouteFoldersScope {
  folders: Atom<CMSRouteFolder[]>;
  countSelector: CountSelector;
  activeFolderID: null | string;
}

export interface ICMSRouteFoldersProvider {
  Component: React.FC;
  countSelector: CountSelector;
}
