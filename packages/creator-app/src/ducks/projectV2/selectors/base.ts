import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  all: allProjectsSelector,
  count: projectsCountSelector,
  byID: projectByIDSelector,
  getByID: getProjectByIDSelector,
} = createCRUDSelectors(STATE_KEY);
