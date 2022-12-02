import React from 'react';

import Page from '@/components/Page';
import { NLURoute } from '@/config/routes';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { SharePopperProvider } from '../../contexts';
import { EntitiesHeader, IntentsHeader, SidebarHeader, UnclassifiedHeader } from './components';

const headerContent: Record<NLURoute, React.FC | null> = {
  [NLURoute.INTENTS]: IntentsHeader,
  [NLURoute.ENTITIES]: EntitiesHeader,
  [NLURoute.UNCLASSIFIED]: UnclassifiedHeader,
};

const NLUHeader: React.FC = () => {
  const nlu = useNLUManager();
  const logoOptions = useLogoButtonOptions();
  const HeaderContent = headerContent[nlu.activeTab];

  return (
    <SharePopperProvider>
      <Page.Header
        renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}
        containerStyles={!HeaderContent ? { width: '310px' } : undefined}
      >
        <SidebarHeader />
        {HeaderContent && <HeaderContent />}
      </Page.Header>
    </SharePopperProvider>
  );
};

export default NLUHeader;
