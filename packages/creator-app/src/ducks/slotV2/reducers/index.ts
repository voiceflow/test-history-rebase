import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const slotReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers).build();

export default slotReducer;
