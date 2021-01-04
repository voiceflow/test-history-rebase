import { createCRUDSelectors } from '../utils/crud';
import { STATE_KEY } from './constants';

// selectors
export const {
  root: rootProjectsSelector,
  all: allProjectsSelector,
  map: projectsMapSelector,
  byID: projectByIDSelector,
  has: hasProjectsSelector,
} = createCRUDSelectors(STATE_KEY);
