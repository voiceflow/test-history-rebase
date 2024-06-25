import type { Client, ClientMeta } from '@logux/client';
import type * as Logux from '@logux/core';
import type { LoguxReduxStore } from '@logux/redux';
import type * as UI from '@voiceflow/ui';
import type * as Redux from 'redux';
import type { AnyAction } from 'typescript-fsa';
import type { Assign } from 'utility-types';

import type { State } from '@/ducks';
import type { ActionInvalidator, ActionReverter } from '@/ducks/utils';

export type {
  Action,
  ActionPayload,
  ActionReducer,
  AnyAction,
  Reducer,
  RootReducer,
  RootState,
  ThunkDispatch,
  ThunkResult,
} from '@voiceflow/ui';

export { State };

// dispatch
export type Dispatchable = AnyAction | AnyThunk;

export type DispatchResult<T extends Dispatchable> = T extends AnyThunk ? ReturnType<T> : T;

export type Dispatcher<A extends any[]> = (...args: A) => Dispatchable;

export interface Dispatch extends Redux.Dispatch<AnyAction> {
  <T extends Dispatchable>(action: T): DispatchResult<T>;

  // cannot dispatch thunks via logux
  local: <T extends AnyAction>(action: T) => Promise<ClientMeta>;
  sync: <T extends AnyAction>(action: T) => Promise<ClientMeta>;
  crossTab: <T extends AnyAction>(action: T) => Promise<ClientMeta>;
  partialSync: <T extends AnyAction>(action: T) => Promise<ClientMeta>;

  // logux node id getter
  getNodeID: () => string;
}

// store

export type Store = Assign<LoguxReduxStore<State, AnyAction, Logux.Log<ClientMeta>, Client>, UI.Store<State, Dispatch>>;

// middleware

export type MiddlewareAPI = UI.StoreMiddlewareAPI<State, Dispatch>;

export type Middleware = UI.StoreMiddleware<State, Dispatch>;

// state

export type GetState = UI.GetState<State>;

// selector

export type Selector<T, A extends any[] = []> = UI.Selector<State, T, A>;

// thunk

export interface ThunkExtra {
  log: Store['log'];
  client: Store['client'];
}

export type AnyThunk = UI.SyncThunk<any, any, Dispatch, ThunkExtra>;

export type SyncThunk<R = void> = UI.SyncThunk<State, R, Dispatch, ThunkExtra>;

export type Thunk<R = void> = UI.Thunk<State, R, Dispatch, ThunkExtra>;

// RPC

export type RPCHandler = (action: AnyAction, dispatch: Dispatch) => boolean;

// History

export type ReverterLookup = Partial<Record<string, ActionReverter<any>[]>>;

export type InvalidatorLookup = Partial<Record<string, Partial<Record<string, ActionInvalidator<any, any>[]>>>>;
