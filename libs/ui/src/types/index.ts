/* eslint-disable @typescript-eslint/ban-types */
import type { Function } from '@voiceflow/common';
import { RGBColor } from 'react-color';
import { Overwrite } from 'utility-types';

import { ActionCreatorLookup, MappedDispatchProps, MappedStateProps, MergeArguments, SelectorLookup } from './store';

export * from './store';

export type Primitive = string | number | boolean;

export type Color = Required<RGBColor>;

export type Either<T extends object, R extends object> =
  | (T & { [K in Exclude<keyof R, keyof T>]?: never })
  | (R & { [K in Exclude<keyof T, keyof R>]?: never });

export type ConnectedProps<
  S extends SelectorLookup<any> = {},
  D extends ActionCreatorLookup = {},
  M extends Function<MergeArguments<S, D, any>, object> = () => {}
> = Overwrite<Overwrite<MappedStateProps<S> & MappedDispatchProps<D>, MappedDispatchProps<D>> & ReturnType<M>, ReturnType<M>>;

export type Point = [x: number, y: number];
export type Pair<T> = [T, T];
