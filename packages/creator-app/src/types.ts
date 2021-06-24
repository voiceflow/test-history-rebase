import { Nullable } from '@voiceflow/ui';
import React from 'react';

export {
  ActionCreatorLookup,
  AnyAction,
  AnyFunction,
  Callback,
  Color,
  ConnectedProps,
  Either,
  Eventual,
  Function,
  MappedDispatchProps,
  MappedStateProps,
  MergeArguments,
  Nullable,
  SelectorLookup,
} from '@voiceflow/ui';

export type Nullish<T> = Nullable<T> | undefined;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type NullableRecord<T extends object> = { [K in keyof T]: Nullable<T[K]> };

export type NonNullishRecord<T extends object> = Required<{ [K in keyof T]: Exclude<T[K], null> }>;

export type Pair<T> = [T, T];

export type Quad<T> = [T, T, T, T];

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

export type HOC<I extends object, O extends object> = (component: React.ComponentType<I>) => React.FC<O>;

export type NonNullableRecord<T extends object> = { [K in keyof T]: NonNullable<T[K]> };

export type ControlProps<T> = {
  value: T;
  onChange: (value: T) => void;
};
