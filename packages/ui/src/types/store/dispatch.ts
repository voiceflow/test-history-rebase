import type { AnyThunk } from '.';

export type Dispatchable = AnyAction | AnyThunk;

export type DispatchResult<T extends Dispatchable> = T extends AnyThunk ? ReturnType<T> : T;

export type Dispatch = <T extends Dispatchable>(dipatchable: T) => DispatchResult<T>;

export type Dispatcher<A extends any[]> = (...args: A) => Dispatchable;

// action

export interface Action<T extends string = string, P = undefined, M extends object | undefined = undefined> {
  type: T;
  payload: P;
  meta: M;
}

export type AnyAction = Action<string, any, any>;

export type ActionType<T> = T extends Action<infer R, any, any> ? R : never;

export type ActionPayload<T> = T extends Action<any, infer R, any> ? R : never;

// thunk

export type ThunkResult<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;

export type ThunkDispatch = <A>(action: A) => ThunkResult<A>;
