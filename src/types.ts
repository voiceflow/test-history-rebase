import React from 'react';
import { RGBColor } from 'react-color';
import { Overwrite } from 'utility-types';

import { AnyThunk, Dispatchable, ThunkResult } from './store/types';

export type Color = Required<RGBColor>;

export type Either<T extends object, R extends object> =
  | (T & { [K in Exclude<keyof R, keyof T>]?: never })
  | (R & { [K in Exclude<keyof T, keyof R>]?: never });

export type Nullable<T> = T | null;

export type NullableRecord<T extends object> = { [K in keyof T]: Nullable<T[K]> };

export type NonNullishRecord<T extends object> = Required<{ [K in keyof T]: Exclude<T[K], null> }>;

export type Pair<T> = [T, T];

export type Quad<T> = [T, T, T, T];

export type Eventual<T> = Promise<T> | T;

export type Point = [x: number, y: number];

export type PathPoint = {
  point: Point;
  toTop: boolean;
  locked: boolean;
  reversed: boolean;
  allowedToTop: boolean;
};

export type PathPoints = PathPoint[];

export type Struct = Record<string, unknown>;

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type MenuOption = {
  label: React.ReactNode;
  value?: any;
  onClick?: React.MouseEventHandler;
};

export type Function<A extends any[] = any[], R = any> = (...args: A) => R;

export type AnyFunction = Function<any[], any>;

export type Callback = Function<[], void>;

export type SelectorLookup<S> = Record<string, (state: S) => any>;

export type ActionCreatorLookup = Record<string, (...args: any[]) => Dispatchable>;

export type MappedStateProps<T extends SelectorLookup<any>> = { [K in keyof T]: ReturnType<T[K]> };

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

export type HOC<I extends object, O extends object> = (component: React.ComponentType<I>) => React.FC<O>;

export type NonNullableRecord<T extends object> = { [K in keyof T]: NonNullable<T[K]> };

export type ControlProps<T> = {
  value: T;
  onChange: (value: T) => void;
};
