import { combineReducers } from 'redux';

import realtimeDiagramReducer, { DIAGRAM_STATE_KEY } from './diagram';
import realtimeProjectReducer, { PROJECT_STATE_KEY } from './project';

export * from './diagram';
export * from './project';

const realtimeReducer = combineReducers({
  [PROJECT_STATE_KEY]: realtimeProjectReducer,
  [DIAGRAM_STATE_KEY]: realtimeDiagramReducer,
});

export default realtimeReducer;

export type RealtimeState = ReturnType<typeof realtimeReducer>;
