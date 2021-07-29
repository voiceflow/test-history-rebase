import { createRootCRUDReducer } from '../../utils';
import { WORKSPACE_INITIAL_STATE } from '../constants';
import { RealtimeWorkspaceState } from '../types';
import crudReducers from './crud';

const realtimeWorkspaceReducer = createRootCRUDReducer<RealtimeWorkspaceState>(WORKSPACE_INITIAL_STATE, crudReducers).build();

export default realtimeWorkspaceReducer;
