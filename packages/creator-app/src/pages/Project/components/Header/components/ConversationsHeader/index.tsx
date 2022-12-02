import React from 'react';

import Page from '@/components/Page';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';
import { Container } from './components';

const ConversationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Container>
        <Page.Header.LogoButton noMargins={true} options={logoOptions} />
      </Container>
    </SharePopperProvider>
  );
};

export default ConversationsHeader;
