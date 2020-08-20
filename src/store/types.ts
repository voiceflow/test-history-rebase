import * as Redux from 'redux';
import { Assign } from 'utility-types';

import type { State } from '@/ducks/_root';

// dispatch

export type Dispatchable = AnyAction | AnyThunk;

export type DispatchResult<T extends Dispatchable> = T extends AnyThunk ? ReturnType<T> : T;

export type Dispatch = <T extends Dispatchable>(dipatchable: T) => DispatchResult<T>;

export type Dispatcher<A extends any[]> = (...args: A) => Dispatchable;

// store

export type Store = Assign<
  Redux.Store<State, any>,
  {
    dispatch<D extends Dispatchable>(dipatchable: D): DispatchResult<D>;
  }
>;

export type StoreMiddlewareAPI = {
  dispatch: <D extends Dispatchable>(dispatchable: D) => DispatchResult<D>;
  getState: () => State;
};

export type StoreMiddleware = {
  (api: StoreMiddlewareAPI): (next: Dispatch) => (action: AnyAction) => any;
};

export type GetState = () => State;

// state

export type RootState<T extends string, S, R = Record<string, any>> = Record<T, S> & R;

// selector

export type Selector<T> = (state: State) => T;

// action

export type Action<T extends string = string, P = undefined, M extends object | undefined = undefined> = {
  type: T;
  payload: P;
  meta: M;
};

export type AnyAction = Action<string, any, any>;

export type ActionType<T> = T extends Action<infer R, any, any> ? R : never;

export type ActionPayload<T> = T extends Action<any, infer R, any> ? R : never;

// thunk

export type SyncThunk<R = void> = (dispatch: ThunkDispatch, getState: () => State) => R;

export type Thunk<R = void> = SyncThunk<Promise<R>>;

export type AnyThunk = SyncThunk<any>;

export type ThunkResult<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;

export type ThunkDispatch = <A>(action: A) => ThunkResult<A>;

// reducer

export type RootReducer<S, A extends AnyAction = never> = (state: S | undefined, action: A) => S;

export type Reducer<S, A extends AnyAction | void = void> = A extends AnyAction ? (state: S, action: A) => S : (state: S) => S;

export type ActionReducer<S, A extends AnyAction | void = void> = A extends AnyAction ? (action: A) => S : () => S;
