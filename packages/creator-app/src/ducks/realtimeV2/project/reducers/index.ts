import { createRootCRUDReducer } from '../../utils/crud';
import { PROJECT_INITIAL_STATE } from '../constants';
import { RealtimeProjectState } from '../types';
import crudReducers from './crud';

const realtimeProjectReducer = createRootCRUDReducer<RealtimeProjectState>(PROJECT_INITIAL_STATE, crudReducers).build();

export default realtimeProjectReducer;
