import React from 'react';

const useFilter = () => {
  const [search, setSearch] = React.useState('');
  return { search, setSearch };
};

export default useFilter;
