import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { SlotState } from '../types';
import crudReducers from './crud';

const slotReducer = createRootCRUDReducer<SlotState>(INITIAL_STATE, crudReducers).build();

export default slotReducer;
