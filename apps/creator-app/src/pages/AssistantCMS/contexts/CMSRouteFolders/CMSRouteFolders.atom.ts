import { atom } from 'jotai';
import { createScope, molecule } from 'jotai-molecules';

import { atomWithSelector } from '@/atoms/store.atom';
import { Designer } from '@/ducks';

import { CMSResourceMolecule } from '../CMSManager/CMSManager.atom';
import type { CMSRouteFolder, ICMSRouteFolders, ICMSRouteFoldersScope } from './CMSRouteFolders.interface';

export const CMSRouteFoldersScope = createScope<ICMSRouteFoldersScope>({
  folders: atom([]),
  countSelector: () => 0,
  activeFolderID: null,
});

export const CMSRouteFoldersMolecule = molecule<ICMSRouteFolders>((getMolecule, getScope): ICMSRouteFolders => {
  const scope = getScope(CMSRouteFoldersScope);
  const cmsManager = getMolecule(CMSResourceMolecule);

  const countAtom = atomWithSelector((state) => scope.countSelector(state, { folderID: scope.activeFolderID }));
  const folderAtom = atomWithSelector((state) => Designer.Folder.selectors.oneByID(state, { id: scope.activeFolderID }));

  const routeFolder = atom<CMSRouteFolder | null>((get) => {
    const folders = get(scope.folders);
    const folder = get(folderAtom);

    if (!folder) return null;

    const count = get(countAtom);

    return {
      id: folder.id,
      url: `${get(cmsManager.url)}/${[...folders, { id: folder.id }].map((folder) => `folder/${folder.id}`).join('/')}`,
      name: folder.name,
      count,
    };
  });

  const activeFolderID = atom((get) => get(routeFolder)?.id ?? null);
  const activeFolderURL = atom((get) => get(routeFolder)?.url ?? null);

  const foldersAtom = atom((get) => {
    const folder = get(routeFolder);
    const folders = get(scope.folders);

    if (!folder) return folders;

    return [...folders, folder];
  });

  return {
    folders: foldersAtom,
    activeFolderID,
    activeFolderURL,
  };
});
