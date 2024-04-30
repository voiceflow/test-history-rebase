import React from 'react';

import { useContextApi, useEnableDisable } from '@/hooks';

import type * as T from './types';

export const DEFAULT_STATE: T.ContextValue<any> = {
  items: [],
};

export const Context = React.createContext<T.ContextValue<any>>(DEFAULT_STATE);
export const { Consumer: ContextConsumer } = Context;

export const Provider: React.FC<React.PropsWithChildren<T.ContextValue<any>>> = ({ children, ...props }) => {
  const api = useContextApi(props);

  return <Context.Provider value={api}>{children}</Context.Provider>;
};

export const useContext = <I extends T.Item>(): T.ContextValue<I> => React.useContext(Context);

export const ROW_DEFAULT_STATE: T.RowContextValue<any> = {
  item: {},
  index: 0,
  isLast: false,
  isFirst: false,
  hovered: false,
};

export const RowContext = React.createContext<T.RowContextValue<any>>(ROW_DEFAULT_STATE);
export const { Consumer: RowContextConsumer } = RowContext;

export const RowProvider: React.FC<T.RowProviderProps> = ({ children, ...props }) => {
  const [hovered, onMouseEnter, onMouseLeave] = useEnableDisable(false);

  const api = useContextApi({ ...props, hovered });

  return <RowContext.Provider value={api}>{children({ hovered, onMouseEnter, onMouseLeave })}</RowContext.Provider>;
};

export const useRowContext = <I extends T.Item>(): T.RowContextValue<I> => React.useContext(RowContext);
