import type { Function, Nullish } from '@voiceflow/common';
import { MappedStateProps, SelectorLookup } from '@voiceflow/ui';
import React from 'react';
import { Overwrite } from 'utility-types';

import { AnyThunk, Dispatchable, ThunkResult } from '@/store/types';

export { PathPoint, PathPoints, Point, Viewport } from '@voiceflow/realtime-sdk';
export { AnyAction, Color, Either, MappedStateProps, SelectorLookup } from '@voiceflow/ui';

export type ActionCreatorLookup = Record<string, (...args: any[]) => Dispatchable>;

export type MappedDispatchProps<T extends ActionCreatorLookup> = {
  [K in keyof T]: ReturnType<T[K]> extends AnyThunk ? (...args: Parameters<T[K]>) => ThunkResult<ReturnType<T[K]>> : T[K];
};

export type MergeArguments<S extends SelectorLookup<any> = {}, D extends ActionCreatorLookup = {}, P extends object = {}> = [
  MappedStateProps<S>,
  MappedDispatchProps<D>,
  P
];

export type ConnectedProps<
  S extends SelectorLookup<any> = {},
  D extends ActionCreatorLookup = {},
  M extends Function<MergeArguments<S, D, any>, object> = () => {}
> = Overwrite<Overwrite<MappedStateProps<S> & MappedDispatchProps<D>, MappedDispatchProps<D>> & ReturnType<M>, ReturnType<M>>;

export type Pair<T> = [T, T];

export type Quad<T> = [T, T, T, T];

export type HOC<I extends object, O extends object> = (component: React.ComponentType<I>) => React.FC<O>;

export type NullishRecord<T> = {
  [K in keyof T]: Nullish<T[K]>;
};

export interface ControlProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export type RequiredProps<T, K extends keyof T> = { [P in K]-?: T[P] };
