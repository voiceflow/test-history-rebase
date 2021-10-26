import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const intentSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allIntentsSelector = intentSelectors.all;
/**
 * @deprecated
 */
export const intentByIDSelector = intentSelectors.byID;
/**
 * @deprecated
 */
export const intentsByIDsSelector = intentSelectors.findByIDs;
/**
 * @deprecated
 */
export const allIntentIDsSelector = intentSelectors.allIDs;
