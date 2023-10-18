import { Nullable } from '@voiceflow/common';
import React from 'react';
import { useSelector } from 'react-redux';

import type { State } from '@/ducks';

export const createSelectorContext = <T extends (state: State) => any>(selector: T) => {
  const Context = React.createContext<Nullable<ReturnType<T>>>(null);

  const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const value = useSelector(selector);

    return <Context.Provider value={value ?? null}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    Consumer: Context.Consumer,
  };
};

export const createHookContext = <T extends () => any>(useHook: T) => {
  const Context = React.createContext<Nullable<ReturnType<T>>>(null);

  const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const value = useHook();

    return <Context.Provider value={value ?? null}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    Consumer: Context.Consumer,
  };
};
