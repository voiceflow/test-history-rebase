import React from 'react';

import { NLURoute } from '@/config/routes';

const useFilter = (activeTab: NLURoute) => {
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setSearch('');
  }, [activeTab]);

  return { search, setSearch };
};

export default useFilter;
