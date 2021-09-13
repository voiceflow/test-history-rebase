import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import * as ProjectListSelectorsV1 from '@/ducks/projectList/selectors';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

const { all: _allProjectListsSelector, byID: _projectListByIDSelector } = createCRUDSelectors(STATE_KEY);

export const allProjectListsSelector = Feature.createAtomicActionsSelector([
  ProjectListSelectorsV1.allProjectListsSelector,
  _allProjectListsSelector,
]);

export const projectListByIDSelector = Feature.createAtomicActionsSelector(
  [ProjectListSelectorsV1.projectListByIDSelector, _projectListByIDSelector, idParamSelector],
  (getProjectListV1, projectListV2, projectID) => [projectID ? getProjectListV1(projectID) : null, projectListV2]
);

export const defaultProjectListSelector = createSelector(
  [allProjectListsSelector],
  (projectLists) => projectLists.find(({ name }) => name === Realtime.DEFAULT_PROJECT_LIST_NAME) ?? null
);
