import { createSelector } from 'reselect';

import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils/selector.util';
import { STATE_KEY } from './variable.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const mapByName = createSelector(all, (variables) => Object.fromEntries(variables.map((variable) => [variable.name, variable])));

export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(all);

export const names = createSelector([all], (variables) => variables.map((variable) => variable.name));
