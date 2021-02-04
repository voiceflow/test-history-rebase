import type { State } from '@/ducks/_root';

import type * as Generics from './generics';

export * from './shared';

export { State };

// store

export type Store = Generics.Store<State>;

export type StoreMiddlewareAPI = Generics.StoreMiddlewareAPI<State>;

export type StoreMiddleware = Generics.StoreMiddleware<State>;

// state

export type GetState = Generics.GetState<State>;

// selector

export type Selector<T> = Generics.Selector<State, T>;

// thunk

export type AnyThunk = Generics.SyncThunk<any, any>;

export type SyncThunk<R = void> = Generics.SyncThunk<State, R>;

export type Thunk<R = void> = Generics.Thunk<State, R>;
