import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crud';

import { DEFAULT_LIST_NAME, STATE_KEY } from './constants';

export const { all: allProjectListsSelector, byID: projectListByIDSelector } = createCRUDSelectors(STATE_KEY);

export const defaultProjectListSelector = createSelector(
  [allProjectListsSelector],
  (lists) => lists.find((list) => list.name === DEFAULT_LIST_NAME) || null
);
