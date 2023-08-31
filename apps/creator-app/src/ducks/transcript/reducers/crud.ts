import { createCRUDReducers } from '@/ducks/utils/crudV2';

import { crudActions } from '../actions';
import { createReducer } from './utils';

const crudReducers = createCRUDReducers(createReducer, crudActions);

export default crudReducers;
