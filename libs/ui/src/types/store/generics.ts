import type * as Redux from 'redux';
import type { Assign } from 'utility-types';

import type { AnyAction, Dispatch } from './dispatch';

// store

export type GetState<S> = () => S;

export type Store<S, D = Dispatch> = Assign<
  Redux.Store<S, any>,
  {
    dispatch: D;
  }
>;

export interface StoreMiddlewareAPI<S, D = Dispatch> {
  dispatch: D;
  getState: GetState<S>;
}

export interface StoreMiddleware<S, D = Dispatch> {
  (api: StoreMiddlewareAPI<S, D>): (next: Redux.Dispatch<AnyAction>) => (action: AnyAction) => any;
}

// selector

export type Selector<S, T, A extends any[] = []> = (state: S, ...args: A) => T;

// thunk

export type SyncThunk<S, R, D = Dispatch, E = never> = [E] extends [never]
  ? (dispatch: D, getState: GetState<S>) => R
  : (dispatch: D, getState: GetState<S>, extra: E) => R;

export type Thunk<S, R, D = Dispatch, E = never> = SyncThunk<S, Promise<R>, D, E>;
