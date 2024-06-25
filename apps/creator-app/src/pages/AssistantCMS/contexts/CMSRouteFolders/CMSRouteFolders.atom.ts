import { atom } from 'jotai';
import { createScope, molecule } from 'jotai-molecules';

import { atomWithSelector } from '@/atoms/store.atom';
import { Designer } from '@/ducks';

import type { CMSRouteFolder, ICMSRouteFolders, ICMSRouteFoldersScope } from './CMSRouteFolders.interface';

export const CMSRouteFoldersScope = createScope<ICMSRouteFoldersScope>({
  folders: atom([]),
  pathname: '',
  folderID: null,
  folderScope: '' as any,
});

export const CMSRouteFoldersMolecule = molecule<ICMSRouteFolders>((_getMolecule, getScope): ICMSRouteFolders => {
  const scope = getScope(CMSRouteFoldersScope);

  const folderAtom = atomWithSelector((state) => Designer.Folder.selectors.oneByID(state, { id: scope.folderID }));

  const routeFolder = atom<CMSRouteFolder | null>((get) => {
    const folders = get(scope.folders);
    const folder = get(folderAtom);

    if (!folder) return null;

    const parentFolderPathname = folders.map((folder) => `folder/${folder.id}`).join('/');

    return {
      id: folder.id,
      name: folder.name,
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      pathname: `${scope.pathname}${parentFolderPathname ? `/${parentFolderPathname}` : ''}/folder/:folderID`,
    };
  });

  const activeFolderID = atom((get) => get(routeFolder)?.id ?? null);
  const activeFolderScope = atom(() => scope.folderScope);
  const activeFolderPathname = atom((get) => get(routeFolder)?.pathname ?? scope.pathname);

  const foldersAtom = atom((get) => {
    const folder = get(routeFolder);
    const folders = get(scope.folders);

    if (!folder) return folders;

    return [...folders, folder];
  });

  return {
    folders: foldersAtom,
    rootPathname: atom(() => scope.pathname),
    activeFolderID,
    activeFolderScope,
    activeFolderPathname,
  };
});
