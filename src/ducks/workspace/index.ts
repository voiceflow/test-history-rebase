import { RootReducer } from '@/store/types';

import { AnyWorkspaceAction, WorkspaceAction } from './actions';
import { INITIAL_STATE } from './constants';
import { WorkspaceState } from './types';

export * from './constants';
export * from './selectors';
export * from './actions';
export * from './sideEffects';
export * from './types';

// reducers

const workspaceReducer: RootReducer<WorkspaceState, AnyWorkspaceAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WorkspaceAction.UPDATE_CURRENT_WORKSPACE:
      window.localStorage.setItem('team', action.payload);
      return {
        ...state,
        activeWorkspaceID: action.payload,
      };
    case WorkspaceAction.UPDATE_WORKSPACES:
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    default:
      return state;
  }
};

export default workspaceReducer;
