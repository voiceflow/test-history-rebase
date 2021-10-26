import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import { ProjectState } from '../types';
import crudReducers from './crud';
import updateVendor from './updateVendor';

const realtimeProjectReducer = createRootCRUDReducer<ProjectState>(INITIAL_STATE, crudReducers)
  .immerCase(...updateVendor)
  .build();

export default realtimeProjectReducer;
