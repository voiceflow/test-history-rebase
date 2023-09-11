import { atom } from 'jotai';
import { splitAtom } from 'jotai/utils';
import { createScope, molecule } from 'jotai-molecules';
import { generatePath } from 'react-router-dom';

import { atomWithSelector } from '@/atoms/store.atom';
import { Designer } from '@/ducks';

import type { CMSFolder, CMSManager, CMSManagerConfig } from './CMSManager.interface';

export const CMSResourceScope = createScope<CMSManagerConfig<any, any>>({
  search: () => false,
  effects: {
    patchOne: () => undefined,
    deleteOne: () => undefined,
    deleteMany: () => undefined,
  } as any,
  pathname: '',
  folderID: null,
  selectors: { oneByID: () => null, allByFolderID: () => [] },
  versionID: '',
  folderScope: '' as any,
  searchContext: atom({}),
});

export const CMSResourceMolecule = molecule<CMSManager<any>>((_, getScope) => {
  const scope = getScope(CMSResourceScope);

  const items = splitAtom(atomWithSelector((state) => scope.selectors.allByFolderID(state, { folderID: scope.folderID })));

  const folders = splitAtom(
    atomWithSelector((state) =>
      Designer.Folder.selectors
        .allByScopeAndFolderID(state, { folderID: scope.folderID, folderScope: scope.folderScope })
        .map<CMSFolder>((folder) => ({ ...folder, group: true }))
    )
  );

  const originalSearch = atom('');

  const search = atom((get) => get(originalSearch).trim().toLocaleLowerCase());

  const dataToRender = atom((get) => {
    const allItems = get(items);
    const allFolders = get(folders);

    const context = {
      ...get(scope.searchContext),
      search: get(search),
      originalSearch: get(originalSearch),
    };

    if (!context.search) return [...allFolders, ...allItems];

    return [...allFolders, ...allItems].filter((itemAtom) => scope.search(get(itemAtom), context));
  });

  const folderID = atom(scope.folderID);

  const itemsSize = atom((get) => get(items).length);

  const foldersSize = atom((get) => get(folders).length);

  const folderScope = atom(scope.folderScope);

  const dataToRenderSize = atom((get) => get(dataToRender).length);

  const isEmpty = atom((get) => get(itemsSize) === 0 && get(foldersSize) === 0);

  const isSearchEmpty = atom((get) => get(dataToRenderSize) === 0 && get(search) !== '' && !get(isEmpty));

  const effects = atom(() => scope.effects);
  const pathname = atom(scope.pathname);
  const selectors = atom(() => scope.selectors);
  const versionID = atom(scope.versionID);

  const url = atom((get) => generatePath(get(pathname), { versionID: get(versionID) }));

  return {
    url,
    items,
    search,
    isEmpty,
    folders,
    effects,
    pathname,
    folderID,
    itemsSize,
    selectors,
    versionID,
    foldersSize,
    folderScope,
    dataToRender,
    isSearchEmpty,
    originalSearch,
  };
});
