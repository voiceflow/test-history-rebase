import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const projectListSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allProjectListsSelector = projectListSelectors.all;
/**
 * @deprecated
 */
export const projectListByIDSelector = projectListSelectors.byID;
