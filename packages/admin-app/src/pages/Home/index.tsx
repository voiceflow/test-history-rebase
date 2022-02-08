import React from 'react';

import { PageTitle } from '@/components/PageLayout';

import InternalLookup from './components/InternalLookup/InternalLookup';

const Home: React.FC = () => (
  <>
    <PageTitle>Admin Lookup Emporium</PageTitle>
    <hr />
    <InternalLookup />
  </>
);

export default Home;
