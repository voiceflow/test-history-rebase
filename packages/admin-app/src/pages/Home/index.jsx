import React from 'react';

import { AdminTitle } from '@/styles/components';

import InternalLookup from './components/InternalLookup/InternalLookup';
import { HomeWrapper } from './styles';

const Home = () => (
  <HomeWrapper>
    <AdminTitle>Admin Lookup Emporium</AdminTitle>
    <hr />
    <InternalLookup />
  </HomeWrapper>
);

export default Home;
