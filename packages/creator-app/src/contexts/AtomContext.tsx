import React from 'react';

export interface AtomContextValue {
  atoms: Map<string, { value: any; listeners: ((value: any) => void)[] }>;
}

export const createAtomContext = (): React.Context<AtomContextValue> & { UncontrolledProvider: React.FC<React.PropsWithChildren> } => {
  const context = React.createContext<AtomContextValue>({ atoms: new Map() });

  return {
    ...context,
    UncontrolledProvider: ({ children }) => {
      const atoms = React.useMemo(() => new Map(), []);
      const api = React.useMemo(() => ({ atoms }), [atoms]);

      return <context.Provider value={api}>{children}</context.Provider>;
    },
  };
};

export const AtomContext = createAtomContext();
export const { Provider: AtomContextProvider } = AtomContext;
