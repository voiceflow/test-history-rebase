import * as Feature from '@/ducks/feature';
import * as ProjectSelectorsV1 from '@/ducks/project/selectors';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

const {
  all: _allProjectsSelector,
  count: _projectsCountSelector,
  byID: _projectByIDSelector,
  getByID: _getProjectByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const allProjectsSelector = Feature.createAtomicActionsSelector([ProjectSelectorsV1.allProjectsSelector, _allProjectsSelector]);

export const projectByIDSelector = Feature.createAtomicActionsSelector(
  [ProjectSelectorsV1.projectByIDSelector, _projectByIDSelector, idParamSelector],
  (getProjectV1, projectV2, projectID) => [projectID ? getProjectV1(projectID) : null, projectV2]
);

export const getProjectByIDSelector = Feature.createAtomicActionsSelector([ProjectSelectorsV1.projectByIDSelector, _getProjectByIDSelector]);

export const projectsCountSelector = Feature.createAtomicActionsSelector([ProjectSelectorsV1.projectsCountSelector, _projectsCountSelector]);
