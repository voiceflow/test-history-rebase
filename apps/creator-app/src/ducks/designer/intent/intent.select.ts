import { createSelector } from 'reselect';

import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils';
import { STATE_KEY } from './intent.state';

export const root = createDesignerSelector(STATE_KEY);

export const crudSelectors = createDesignerCRUDSelectors(root);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = crudSelectors;

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const nameByID = createSelector(oneByID, (intent) => intent?.name ?? null);

export const entityOrderByID = createSelector(oneByID, (intent) => intent?.entityOrder ?? null);

export const automaticRepromptByID = createSelector(oneByID, (intent) => intent?.automaticReprompt ?? null);
