import { useContextApi } from '@voiceflow/ui';
import React from 'react';

interface FilterContextType {
  search: string;
  status: string;
}

export const FilterContext = React.createContext<FilterContextType>({ search: '', status: '' });

export const FilterContextProvider: React.FC<React.PropsWithChildren<FilterContextType>> = ({
  search,
  status,
  children,
}) => {
  const api = useContextApi({ search, status });

  return <FilterContext.Provider value={api}>{children}</FilterContext.Provider>;
};
