import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

export interface LastCreatedComponentContextValue {
  componentID: Nullable<string>;
  setComponentID: (id: Nullable<string>) => void;
}

export const LastCreatedComponentContext = React.createContext<LastCreatedComponentContextValue>({
  componentID: null,
  setComponentID: () => {},
});

export const LastCreatedComponentProvider: React.OldFC = ({ children }) => {
  const [componentID, setComponentID] = React.useState<Nullable<string>>(null);

  const api = useContextApi<LastCreatedComponentContextValue>({ componentID, setComponentID });

  return <LastCreatedComponentContext.Provider value={api}>{children}</LastCreatedComponentContext.Provider>;
};
