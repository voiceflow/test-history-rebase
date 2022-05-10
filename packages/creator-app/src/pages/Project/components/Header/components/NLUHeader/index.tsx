import React from 'react';

import { Header, HeaderLogoButton } from '@/components/ProjectPage';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { ContentHeader, SidebarHeader } from './components';

const NLUHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <Header renderLogoButton={() => <HeaderLogoButton options={logoOptions} />}>
      <SidebarHeader />
      <ContentHeader />
    </Header>
  );
};

export default NLUHeader;
