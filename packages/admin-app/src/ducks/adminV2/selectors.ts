import { createSelector } from 'reselect';

import { createRootSelector } from '@/store/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const themeSelector = createSelector([rootSelector], ({ theme }) => theme);

export const darkSelector = createSelector([rootSelector], ({ dark }) => dark);

export const betaCreatorSelector = createSelector([rootSelector], ({ betaCreator }) => betaCreator);

export const creatorSelector = createSelector([rootSelector], ({ creator }) => creator);

export const boardsSelector = createSelector([rootSelector], ({ boards }) => boards);

export const errorSelector = createSelector([rootSelector], ({ error }) => error);

export const vendorsSelector = createSelector([rootSelector], ({ vendors }) => vendors);

export const chargesSelector = createSelector([rootSelector], ({ charges }) => charges);
