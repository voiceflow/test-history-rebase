import { Project } from '@/models';

import { createCRUDSelectors } from '../utils/crud';
import { STATE_KEY } from './constants';

// selectors
export const {
  root: rootProjectsSelector,
  all: allProjectsSelector,
  map: projectsMapSelector,
  key: projectsKeySelector,
  byID: projectByIDSelector,
  has: hasProjectsSelector,
} = createCRUDSelectors<Project>(STATE_KEY);
