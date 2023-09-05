import { createSelector } from 'reselect';

import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils';
import { STATE_KEY } from './story.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const start = createSelector(all, (stories) => stories.find((story) => story.isStart));

export const flowIDByID = createSelector(oneByID, (story) => story?.flowID ?? null);

export const startFlowID = createSelector(start, (story) => story?.flowID ?? null);

export const triggerOrderByID = createSelector(oneByID, (story) => story?.triggerOrder ?? []);
