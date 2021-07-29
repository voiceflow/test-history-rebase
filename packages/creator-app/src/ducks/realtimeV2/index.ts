import { combineReducers } from 'redux';

import realtimeDiagramReducer, { DIAGRAM_STATE_KEY } from './diagram';
import realtimeProjectReducer, { PROJECT_STATE_KEY } from './project';
import realtimeProjectListReducer, { PROJECT_LIST_STATE_KEY } from './projectList';
import realtimeWorkspaceReducer, { WORKSPACE_STATE_KEY } from './workspace';

export * from './diagram';
export * from './project';
export * from './projectList';
export * from './workspace';

const realtimeReducer = combineReducers({
  [PROJECT_STATE_KEY]: realtimeProjectReducer,
  [DIAGRAM_STATE_KEY]: realtimeDiagramReducer,
  [WORKSPACE_STATE_KEY]: realtimeWorkspaceReducer,
  [PROJECT_LIST_STATE_KEY]: realtimeProjectListReducer,
});

export default realtimeReducer;

export type RealtimeState = ReturnType<typeof realtimeReducer>;
