import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';
import updateImage from './updateImage';
import updateName from './updateName';

const realtimeOrganizationReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...updateName)
  .immerCase(...updateImage)
  .build();

export default realtimeOrganizationReducer;
