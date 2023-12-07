import { createSelector } from 'reselect';

import { createDesignerCRUDSelectors, createDesignerSelector, folderIDParamSelector, folderScopeParamSelector } from '../utils/selector.util';
import { STATE_KEY } from './folder.state';

const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const isFolderID = createSelector([map], (foldersMap) => (id: string) => !!foldersMap[id]);

export const allByScope = createSelector([all, folderScopeParamSelector], (folders, folderScope) =>
  folders.filter((folder) => folder.scope === folderScope)
);

export const hasScopeFolders = createSelector([allByScope], (scopeFolders) => !!scopeFolders.length);

export const allByScopeAndFolderID = createSelector([all, folderIDParamSelector, folderScopeParamSelector], (folders, folderID, folderScope) =>
  folders.filter((folder) => folder.parentID === folderID && folder.scope === folderScope)
);
