import React from 'react';

import Page from '@/components/Page';
import { NLURoute } from '@/config/routes';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import LogoOnlyHeader from '../LogoOnlyHeader';
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

  return nlu.inFullScreenTab ? (
    <LogoOnlyHeader />
  ) : (
    <Page.Header
      containerStyles={!HeaderContent ? { width: '310px' } : undefined}
      renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}
    >
      <SidebarHeader />
      {HeaderContent && <HeaderContent />}
    </Page.Header>
  );
};

export default NLUHeader;
