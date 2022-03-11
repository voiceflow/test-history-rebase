import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const { all: allProjectListsSelector, byID: projectListByIDSelector } = createCRUDSelectors(STATE_KEY);

export const defaultProjectListSelector = createSelector(
  [allProjectListsSelector],
  (projectLists) => projectLists.find(({ name }) => name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null
);
