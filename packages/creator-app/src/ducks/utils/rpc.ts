import { ActionCreator, isType } from 'typescript-fsa';

import { RPCHandler, SyncThunk, Thunk } from '@/store/types';

export const createRPC =
  <T>(createAction: ActionCreator<T>, sideEffect: (payload: T) => Thunk | SyncThunk): RPCHandler =>
  (action, dispatch) => {
    if (isType(action, createAction)) {
      dispatch(sideEffect(action.payload));

      return true;
    }

    return false;
  };
