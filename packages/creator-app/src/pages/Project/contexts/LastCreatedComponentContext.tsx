import { Nullable } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

export interface LastCreatedComponentContextType {
  componentID: Nullable<string>;
  setComponentID: (id: Nullable<string>) => void;
}

export const LastCreatedComponentContext = React.createContext<LastCreatedComponentContextType>({
  componentID: null,
  setComponentID: () => {},
});

export const LastCreatedComponentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [componentID, setComponentID] = React.useState<Nullable<string>>(null);

  const api = useContextApi<LastCreatedComponentContextType>({ componentID, setComponentID });

  return <LastCreatedComponentContext.Provider value={api}>{children}</LastCreatedComponentContext.Provider>;
};
