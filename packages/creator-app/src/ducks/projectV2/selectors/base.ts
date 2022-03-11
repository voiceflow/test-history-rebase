import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const { all: allProjectsSelector, count: projectsCountSelector, byID: projectByIDSelector } = createCRUDSelectors(STATE_KEY);

export const getProjectByIDSelector = createCurriedSelector(projectByIDSelector);
