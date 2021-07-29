import { Function, MappedStateProps, Nullable, SelectorLookup } from '@voiceflow/ui';
import React from 'react';
import { Overwrite } from 'utility-types';

import { AnyThunk, Dispatchable, ThunkResult } from '@/store/types';

export { AnyAction, AnyFunction, Callback, Color, Either, Eventual, Function, MappedStateProps, Nullable, SelectorLookup } from '@voiceflow/ui';

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

export type Nullish<T> = Nullable<T> | undefined;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type NullableRecord<T extends object> = { [K in keyof T]: Nullable<T[K]> };

export type NonNullishRecord<T extends object> = Required<{ [K in keyof T]: Exclude<T[K], null> }>;

export type Pair<T> = [T, T];

export type Quad<T> = [T, T, T, T];

export type Point = [x: number, y: number];

export interface PathPoint {
  point: Point;
  toTop: boolean;
  locked: boolean;
  reversed: boolean;
  allowedToTop: boolean;
}

export type PathPoints = PathPoint[];

export type Struct = Record<string, unknown>;

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface MenuOption {
  label: React.ReactNode;
  value?: any;
  onClick?: React.MouseEventHandler;
}

export type HOC<I extends object, O extends object> = (component: React.ComponentType<I>) => React.FC<O>;

export type NonNullableRecord<T extends object> = { [K in keyof T]: NonNullable<T[K]> };

export interface ControlProps<T> {
  value: T;
  onChange: (value: T) => void;
}
