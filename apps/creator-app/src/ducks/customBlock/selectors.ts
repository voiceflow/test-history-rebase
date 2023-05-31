import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const { all: allCustomBlocksSelector, map: customBlockMapSelector, byID: customBlockByIDSelector } = createCRUDSelectors(STATE_KEY);
