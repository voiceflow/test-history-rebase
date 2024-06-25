/* eslint-disable @typescript-eslint/ban-types */
import type { Dispatchable, ThunkResult } from './dispatch';
import type * as Generics from './generics';

export * from './generics';
export * from './shared';

export type AnyThunk = Generics.SyncThunk<any, any, any>;

export type SelectorLookup<S> = Record<string, (state: S) => any>;

export type ActionCreatorLookup = Record<string, (...args: any[]) => Dispatchable>;

export type MappedStateProps<T extends SelectorLookup<any>> = { [K in keyof T]: ReturnType<T[K]> };

export type MappedDispatchProps<T extends ActionCreatorLookup> = {
  [K in keyof T]: ReturnType<T[K]> extends AnyThunk
    ? (...args: Parameters<T[K]>) => ThunkResult<ReturnType<T[K]>>
    : T[K];
};

export type MergeArguments<
  S extends SelectorLookup<any> = {},
  D extends ActionCreatorLookup = {},
  P extends object = {},
> = [MappedStateProps<S>, MappedDispatchProps<D>, P];
