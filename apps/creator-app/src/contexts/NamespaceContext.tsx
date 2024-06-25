import React from 'react';

export type NamespaceContextType = null | string;
export const NamespaceContext = React.createContext<NamespaceContextType>(null);
export const { Consumer: NamespaceConsumer } = NamespaceContext;

export const NamespaceProvider: React.FC<React.PropsWithChildren<{ value: string | string[] }>> = ({
  value,
  children,
}) => {
  const parentNamespace = React.useContext(NamespaceContext);
  const localNamespace = Array.isArray(value) ? value.join('.') : value;
  const namespace = parentNamespace ? `${parentNamespace}.${localNamespace}` : localNamespace;

  return <NamespaceContext.Provider value={namespace}>{children}</NamespaceContext.Provider>;
};
