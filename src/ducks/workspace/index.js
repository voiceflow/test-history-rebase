import { UPDATE_CURRENT_WORKSPACE, UPDATE_WORKSPACES } from './actions';

export * from './constants';
export * from './selectors';
export * from './actions';
export * from './sideEffects';

export const INITIAL_STATE = {
  activeWorkspaceID: localStorage.getItem('team'),
  byId: {},
  allIds: [],
};

// reducers

export default function workspaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_CURRENT_WORKSPACE:
      window.localStorage.setItem('team', action.payload);
      return {
        ...state,
        activeWorkspaceID: action.payload,
      };
    case UPDATE_WORKSPACES:
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    default:
      return state;
  }
}
