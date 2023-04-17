import * as React from 'react';

export const methodNotInjected = () => Promise.reject(new Error('Not injected'));

export const createUseContext =
  <Value>(Context: React.Context<Value>) =>
  () => {
    const value = React.useContext(Context);

    if (value === undefined) {
      throw new Error('useContext must be used within a Context.Provider');
    }

    return value;
  };

export const createContext = <Value>(defaultValue: Value) => {
  const Context = React.createContext<Value>(defaultValue);

  return {
    extend: <ExtensionValue>(extensionDefaultValue: ExtensionValue) => createContext({ ...defaultValue, ...extensionDefaultValue }),
    Context,
    useContext: createUseContext(Context),
    notInjected: methodNotInjected,
  };
};
