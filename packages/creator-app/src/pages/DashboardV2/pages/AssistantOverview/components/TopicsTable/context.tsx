import { useContextApi } from '@voiceflow/ui';
import React from 'react';

interface FilterContextType {
  search: string;
}

export const FilterContext = React.createContext<FilterContextType>({ search: '' });

export const FilterContextProvider: React.FC<React.PropsWithChildren<FilterContextType>> = ({ search, children }) => {
  const api = useContextApi({ search });

  return <FilterContext.Provider value={api}>{children}</FilterContext.Provider>;
};
