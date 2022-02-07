import * as Feature from '@/ducks/feature';
import * as ProjectSelectorsV1 from '@/ducks/project/selectors';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

const { all: _allProjectsSelector, count: _projectsCountSelector, byID: _projectByIDSelector } = createCRUDSelectors(STATE_KEY);

export const allProjectsSelector = Feature.createAtomicActionsSelector([ProjectSelectorsV1.allProjectsSelector, _allProjectsSelector]);

export const projectByIDSelector = Feature.createAtomicActionsSelector(
  [ProjectSelectorsV1.projectByIDSelector, _projectByIDSelector, idParamSelector],
  (getProjectV1, projectV2, projectID) => [projectID ? getProjectV1(projectID) : null, projectV2]
);

export const getProjectByIDSelector = createCurriedSelector(projectByIDSelector);

export const projectsCountSelector = Feature.createAtomicActionsSelector([ProjectSelectorsV1.projectsCountSelector, _projectsCountSelector]);
