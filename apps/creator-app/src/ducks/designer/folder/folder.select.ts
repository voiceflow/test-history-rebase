import { createSelector } from 'reselect';

import {
  createDesignerCRUDSelectors,
  createDesignerSelector,
  folderIDParamSelector,
  folderScopeParamSelector,
  parentIDParamSelector,
} from '../utils/selector.util';
import { STATE_KEY } from './folder.state';

const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const isFolderID = createSelector([map], (foldersMap) => (id: string) => !!foldersMap[id]);

export const allByScope = createSelector([all, folderScopeParamSelector], (folders, folderScope) =>
  folders.filter((folder) => folder.scope === folderScope)
);

export const hasByScope = createSelector([allByScope], (scopeFolders) => !!scopeFolders.length);

export const allByScopeAndParentID = createSelector([allByScope, parentIDParamSelector], (folders, parentID) =>
  folders.filter((folder) => folder.parentID === parentID)
);

export const idsByParentIDMapByScope = createSelector([allByScope], (folders) =>
  folders.reduce<Partial<Record<string, string[]>>>((map, folder) => {
    if (folder.parentID) {
      // eslint-disable-next-line no-param-reassign
      map[folder.parentID] ??= [];
      map[folder.parentID]!.push(folder.id);
    }

    return map;
  }, {})
);

export const allDeeplyNestedIDsByScopeAndParentID = createSelector([idsByParentIDMapByScope, parentIDParamSelector], (idsByParentIDMap, parentID) => {
  const children = parentID ? idsByParentIDMap[parentID] ?? [] : [];

  if (!children.length) return children;

  const buildDeeplyNestedFolderIDs = (ids: string[]): void => {
    if (!ids.length) return;

    for (const id of ids) {
      const nestedChildren = idsByParentIDMap[id] ?? [];

      children.push(...nestedChildren);

      buildDeeplyNestedFolderIDs(nestedChildren);
    }
  };

  buildDeeplyNestedFolderIDs(children);

  return children;
});

export const idsChainByLeafFolderID = createSelector([getOneByID, folderIDParamSelector], (getOneByID, folderID) => {
  if (!folderID) return [];

  const idsChain: string[] = [folderID];
  let parentID = getOneByID({ id: folderID })?.parentID ?? null;

  while (parentID) {
    idsChain.push(parentID);
    parentID = getOneByID({ id: parentID })?.parentID ?? null;
  }

  return idsChain.reverse();
});
