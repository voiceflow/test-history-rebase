import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allProductsSelector,
  map: productMapSelector,
  byID: productByIDSelector,
  byIDs: productsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);
