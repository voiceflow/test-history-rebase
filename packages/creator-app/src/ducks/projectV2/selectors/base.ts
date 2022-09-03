import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const {
  map: projectsMapSelector,
  all: allProjectsSelector,
  byID: projectByIDSelector,
  count: projectsCountSelector,
  getByID: getProjectByIDSelector,
} = createCRUDSelectors(STATE_KEY);
