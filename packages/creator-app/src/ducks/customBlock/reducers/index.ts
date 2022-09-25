import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

export const customBlockReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers);
