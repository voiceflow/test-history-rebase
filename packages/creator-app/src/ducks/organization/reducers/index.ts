import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const realtimeOrganizationReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers).build();

export default realtimeOrganizationReducer;
