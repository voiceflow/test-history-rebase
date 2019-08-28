import React from 'react';

import { AdminTitle } from '@/admin/styles';

import InternalLookup from './components/InternalLookup/InternalLookup';
import { HomeWrapper } from './styles';

const Home = () => {
  return (
    <HomeWrapper>
      <AdminTitle>Will's Lookup Emporium</AdminTitle>
      <hr />
      <InternalLookup />
    </HomeWrapper>
  );
};

export default Home;
