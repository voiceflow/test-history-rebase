import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import rehydrateViewport from './rehydrate';

const versionReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...rehydrateViewport)
  .build();

export default versionReducer;
