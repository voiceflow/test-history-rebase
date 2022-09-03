import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import reloadReducer from './reload';

const intentReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...reloadReducer)
  .build();

export default intentReducer;
