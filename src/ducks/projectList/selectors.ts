import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crud';
import { ProjectList } from '@/models';

import { DEFAULT_LIST_NAME, STATE_KEY } from './constants';

export const {
  root: rootProjectListsSelector,
  all: allProjectListsSelector,
  byID: projectListByIDSelector,
  has: hasProjectListsSelector,
} = createCRUDSelectors<ProjectList>(STATE_KEY);

export const defaultProjectListSelector = createSelector(
  [allProjectListsSelector],
  (lists) => lists.find((list) => list.name === DEFAULT_LIST_NAME) || null
);
