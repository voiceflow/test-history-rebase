import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const projectSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allProjectsSelector = projectSelectors.all;
/**
 * @deprecated
 */
export const projectByIDSelector = projectSelectors.byID;

/**
 * @deprecated
 */
export const projectsCountSelector = projectSelectors.count;
