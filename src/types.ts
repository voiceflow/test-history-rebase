import { Overwrite } from 'utility-types';

import { AnyAction, AnyThunk, Thunk, ThunkResult } from './store/types';

export type Function<A extends any[] = any[], R = any> = (...args: A) => R;

export type AnyFunction = Function<any[], any>;

export type ArgumentsType<T extends AnyFunction> = T extends Function<infer A> ? A : never[];

export type SelectorLookup = Record<string, (state: Record<string, any>) => any>;

export type ThunkAction = AnyAction | Thunk<Record<string, any>, any>;

export type ActionCreatorLookup = Record<string, (...args: any[]) => ThunkAction>;

export type MappedStateProps<T extends SelectorLookup> = { [K in keyof T]: ReturnType<T[K]> };

export type MappedDispatchProps<T extends ActionCreatorLookup> = {
  [K in keyof T]: ReturnType<T[K]> extends AnyThunk ? (...args: ArgumentsType<T[K]>) => ThunkResult<ReturnType<T[K]>> : T[K];
};

// TODO: fix this so it can be used for mergeProps functions
export type MergeProps<S extends SelectorLookup = {}, D extends ActionCreatorLookup = {}, P extends object = {}, R = {}> = (
  stateProps: MappedStateProps<S>,
  dispatchProps: MappedDispatchProps<D>,
  ownProps: P
) => R;

export type ConnectedProps<
  S extends SelectorLookup = {},
  D extends ActionCreatorLookup = {},
  M extends MergeProps<S, D, object, object> = () => {}
> = Partial<Overwrite<MappedStateProps<S> & D & ReturnType<M>, ReturnType<M>>>;
