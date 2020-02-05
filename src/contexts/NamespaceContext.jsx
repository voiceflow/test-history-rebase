import React from 'react';

export const NamespaceContext = React.createContext(null);
export const { Consumer: NamespaceConsumer } = NamespaceContext;

export const NamespaceProvider = ({ value, children }) => {
  const parentNamespace = React.useContext(NamespaceContext);
  const localNamespace = Array.isArray(value) ? value.join('.') : value;
  const namespace = parentNamespace ? `${parentNamespace}.${localNamespace}` : localNamespace;

  return <NamespaceContext.Provider value={namespace}>{children}</NamespaceContext.Provider>;
};
