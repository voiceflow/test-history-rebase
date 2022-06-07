import React from 'react';

import { Header, HeaderLogoButton } from '@/components/ProjectPage';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { SharePopperProvider } from '../../contexts';
import { ContentHeader, SidebarHeader } from './components';

const NLUHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <HeaderLogoButton options={logoOptions} />}>
        <SidebarHeader />
        <ContentHeader />
      </Header>
    </SharePopperProvider>
  );
};

export default NLUHeader;
