import { Nullable } from '@voiceflow/common';
import React from 'react';
import { useSelector } from 'react-redux';

import type { State } from '@/ducks';

// eslint-disable-next-line import/prefer-default-export
export const createSelectorContext = <T extends (state: State) => any>(selector: T) => {
  const Context = React.createContext<Nullable<ReturnType<T>>>(null);

  const Provider: React.FC = ({ children }) => {
    const value = useSelector(selector);

    return <Context.Provider value={value ?? null}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    Consumer: Context.Consumer,
  };
};
