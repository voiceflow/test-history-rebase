import type { AnyAction } from './dispatch';

export type RootReducer<S, A = never> = (state: S | undefined, action: A) => S;

export type Reducer<S, A = void> = A extends AnyAction ? (state: S, action: A) => S : (state: S) => S;

export type ActionReducer<S, A = void> = A extends AnyAction ? (action: A) => S : () => S;
