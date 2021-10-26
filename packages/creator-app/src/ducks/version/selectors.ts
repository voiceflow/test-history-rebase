import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const versionSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const versionByIDSelector = versionSelectors.byID;
