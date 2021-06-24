import * as UI from '@voiceflow/ui';

import type { State } from '../ducks';

export { State };

// store

export type Store = UI.Store<State>;

export type StoreMiddlewareAPI = UI.StoreMiddlewareAPI<State>;

export type StoreMiddleware = UI.StoreMiddleware<State>;

// selector

export type Selector<T> = UI.Selector<State, T>;

// thunk

export type SyncThunk<R = void> = UI.SyncThunk<State, R>;

export type Thunk<R = void> = UI.Thunk<State, R>;
