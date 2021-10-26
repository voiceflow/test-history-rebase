import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const productSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allProductsSelector = productSelectors.all;
/**
 * @deprecated
 */
export const productByIDSelector = productSelectors.byID;
/**
 * @deprecated
 */
export const productsByIDsSelector = productSelectors.findByIDs;
/**
 * @deprecated
 */
export const productMapSelector = productSelectors.map;
