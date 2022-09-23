import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addManyCustomThemes from './addManyCustomThemes';
import crudReducers from './crud';
import updatePlatformData from './updatePlatformData';
import updateVendor from './updateVendor';

const realtimeProjectReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...updateVendor)
  .immerCase(...addManyCustomThemes)
  .immerCase(...updatePlatformData)
  .build();

export default realtimeProjectReducer;
