import React from 'react';

import { HeaderLogoButton } from '@/components/ProjectPage';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';
import { Container } from './components';

const ConversationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Container>
        <HeaderLogoButton options={logoOptions} />
      </Container>
    </SharePopperProvider>
  );
};

export default ConversationsHeader;
