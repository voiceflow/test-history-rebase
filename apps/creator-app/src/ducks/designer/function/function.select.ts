import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils';
import { STATE_KEY } from './function.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);
