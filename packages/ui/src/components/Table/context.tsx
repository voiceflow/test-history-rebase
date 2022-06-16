import { useContextApi } from '@ui/hooks';
import React from 'react';

import * as T from './types';

export const DEFAULT_STATE: T.ContextValue<any> = {
  items: [],
};

export const Context = React.createContext<T.ContextValue<any>>(DEFAULT_STATE);
export const { Consumer: ContextConsumer } = Context;

export const Provider: React.FC<T.ContextValue<any>> = ({ children, ...props }) => {
  const api = useContextApi(props);

  return <Context.Provider value={api}>{children}</Context.Provider>;
};

export const useContext = <I extends T.Item>(): T.ContextValue<I> => React.useContext(Context);
