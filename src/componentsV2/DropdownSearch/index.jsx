import React from 'react';

import { Searchable } from './components';

const SearchableDropdown = (props) => {
  return <Searchable {...props} />;
};

export default React.memo(SearchableDropdown);
