import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { IntentState } from '../types';
import crudReducers from './crud';

const intentReducer = createRootCRUDReducer<IntentState>(INITIAL_STATE, crudReducers).build();

export default intentReducer;
