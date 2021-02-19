import { compositeReducer } from '@/ducks/utils';
import createCRUDReducer from '@/ducks/utils/crud';
import { Workspace } from '@/models';
import { RootReducer } from '@/store/types';

import { AnyWorkspaceAction, WorkspaceAction } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const workspaceCRUDReducer = createCRUDReducer<Workspace>(STATE_KEY);

const activeWorkspaceIDReducer: RootReducer<string | null, AnyWorkspaceAction> = (state = localStorage.getItem('team'), action) => {
  if (action.type === WorkspaceAction.UPDATE_CURRENT_WORKSPACE) {
    localStorage.setItem('team', action.payload);

    return action.payload;
  }

  return state;
};

export default compositeReducer(workspaceCRUDReducer, {
  activeWorkspaceID: activeWorkspaceIDReducer,
});
