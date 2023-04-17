import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import reloadReducers from './reload';

const slotReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...reloadReducers)
  .build();

export default slotReducer;
