import React from 'react';
import { Overwrite } from 'utility-types';

import type { State } from '@/ducks/_root';

import { AnyThunk, Dispatchable, ThunkResult } from './store/types';

export type Pair<T> = [T, T];

export type Point = Pair<number>;

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

export type MapManagedItemManager<I> = {
  key: string;
  index: number;
  onUpdate: (value: Partial<I>) => void;
  onRemove: () => void;
  toggleOpen: () => void;
};

export type MapManagedRenderer<I> = (item: I, itemManager: MapManagedItemManager<I>) => React.ReactNode;

export type MapManaged<I> = (renderer: MapManagedRenderer<I>) => React.ReactNode;

export type MapManagedManager<I> = {
  keys: string[];
  items: I[];
  onAdd: (...args: any[]) => void;
  onUpdate: (key: string, value: Partial<I>) => void;
  onRemove: (key: string) => void;
  onReorder: (from: number, to: number) => void;
  toggleOpen: (key: string) => void;
  mapManaged: MapManaged<I>;
  onAddToStart: (...args: any[]) => void;
  latestCreatedKey?: string;
};

export type Function<A extends any[] = any[], R = any> = (...args: A) => R;

export type AnyFunction = Function<any[], any>;

export type Callback = Function<[], void>;

export type SelectorLookup = Record<string, (state: State) => any>;

export type ActionCreatorLookup = Record<string, (...args: any[]) => Dispatchable>;

export type MappedStateProps<T extends SelectorLookup> = { [K in keyof T]: ReturnType<T[K]> };

export type MappedDispatchProps<T extends ActionCreatorLookup> = {
  [K in keyof T]: ReturnType<T[K]> extends AnyThunk ? (...args: Parameters<T[K]>) => ThunkResult<ReturnType<T[K]>> : T[K];
};

export type MergeArguments<S extends SelectorLookup = {}, D extends ActionCreatorLookup = {}, P extends object = {}> = [
  MappedStateProps<S>,
  MappedDispatchProps<D>,
  P
];

export type ConnectedProps<
  S extends SelectorLookup = {},
  D extends ActionCreatorLookup = {},
  M extends Function<MergeArguments<S, D, any>, object> = () => {}
> = Overwrite<Overwrite<MappedStateProps<S> & MappedDispatchProps<D>, MappedDispatchProps<D>> & ReturnType<M>, ReturnType<M>>;

export type HOC<I extends object, O extends object> = (component: React.ComponentType<I>) => React.FC<O>;
