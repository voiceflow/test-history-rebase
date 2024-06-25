import type { ActionCreator } from 'typescript-fsa';
import { isType } from 'typescript-fsa';

import type { RPCHandler, SyncThunk, Thunk } from '@/store/types';

export const createRPC =
  <T>(createAction: ActionCreator<T>, sideEffect: (payload: T) => Thunk | SyncThunk): RPCHandler =>
  (action, dispatch) => {
    if (isType(action, createAction)) {
      dispatch(sideEffect(action.payload));

      return true;
    }

    return false;
  };
