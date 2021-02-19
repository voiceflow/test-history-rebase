import { Reducer, RootReducer } from '@/store/types';

import { AdminAction, AnyAdminAction, UpdateWorkspace } from './actions';
import { INITIAL_STATE } from './constants';
import { AdminState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const updateWorkspaceReducer: Reducer<AdminState, UpdateWorkspace> = (state, { payload }) => ({
  ...state,
  boards: state.boards.map((board) =>
    board.team_id === payload.workspaceID
      ? {
          ...board,
          ...payload.data,
        }
      : board
  ),
});

const adminReducer: RootReducer<AdminState, AnyAdminAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AdminAction.SET_CREATOR:
      return {
        ...state,
        creator: action.payload.creator,
        boards: action.payload.boards,
      };
    case AdminAction.FIND_CREATOR_FAILED:
      return {
        ...state,
        error: action.payload.error,
      };
    case AdminAction.SET_CHARGES:
      return {
        ...state,
        charges: action.payload.charges,
      };
    case AdminAction.SET_VENDORS:
      return {
        ...state,
        vendors: action.payload.vendors,
      };
    case AdminAction.SET_BETA_CREATOR:
      return {
        ...state,
        betaCreator: action.payload.betaCreator,
      };
    case AdminAction.CLEAR_BETA_CREATOR:
      return {
        ...state,
        betaCreator: {},
      };
    case AdminAction.UPDATE_WORKSPACE:
      return updateWorkspaceReducer(state, action);
    case AdminAction.TOGGLE_THEME:
      return {
        ...state,
        theme: action.payload.theme,
      };
    default:
      return state;
  }
};

export default adminReducer;
