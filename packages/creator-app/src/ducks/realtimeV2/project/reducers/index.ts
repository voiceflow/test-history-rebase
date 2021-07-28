import { createRootReducer } from '../../utils';
import { INITIAL_PROJECT_STATE } from '../constants';
import { RealtimeProjectState } from '../types';

const realtimeProjectReducer = createRootReducer<RealtimeProjectState>(INITIAL_PROJECT_STATE).build();

export default realtimeProjectReducer;
