import { createSelector } from 'reselect';

import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils';
import { STATE_KEY } from './entity.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const mapByName = createSelector(all, (entities) => Object.fromEntries(entities.map((entity) => [entity.name, entity])));

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);
