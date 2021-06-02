import * as Generics from '@/store/types/generics';

import getCombinedReducer from './rootReducer';

export * from '@/store/types/shared';

export type State = ReturnType<ReturnType<typeof getCombinedReducer>>;

// store

export type Store = Generics.Store<State>;

export type StoreMiddlewareAPI = Generics.StoreMiddlewareAPI<State>;

export type StoreMiddleware = Generics.StoreMiddleware<State>;

// selector

export type Selector<T> = Generics.Selector<State, T>;

// thunk

export type AnyThunk = Generics.SyncThunk<any, any>;

export type SyncThunk<R = void> = Generics.SyncThunk<State, R>;

export type Thunk<R = void> = Generics.Thunk<State, R>;
