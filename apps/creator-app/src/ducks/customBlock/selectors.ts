import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allCustomBlocksSelector,
  map: customBlockMapSelector,
  byID: customBlockByIDSelector,
  byIDs: customBlockByIDsSelector,
  allIDs: allCustomBlockIDsSelector,
} = createCRUDSelectors(STATE_KEY);
