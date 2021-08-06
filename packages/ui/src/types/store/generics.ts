import * as Redux from 'redux';
import { Assign } from 'utility-types';

import type { AnyAction, Dispatch, Dispatchable, DispatchResult, ThunkDispatch } from './dispatch';

// store

export type GetState<S> = () => S;

export type Store<S> = Assign<
  Redux.Store<S, any>,
  {
    dispatch<D extends Dispatchable>(dipatchable: D): DispatchResult<D>;
  }
>;

export interface StoreMiddlewareAPI<S> {
  dispatch: <D extends Dispatchable>(dispatchable: D) => DispatchResult<D>;
  getState: GetState<S>;
}

export interface StoreMiddleware<S> {
  (api: StoreMiddlewareAPI<S>): (next: Dispatch) => (action: AnyAction) => any;
}

// selector

export type Selector<S, T> = (state: S) => T;

// thunk

export type SyncThunk<S, R> = (dispatch: ThunkDispatch, getState: GetState<S>) => R;

export type Thunk<S, R> = SyncThunk<S, Promise<R>>;
