import React from 'react';

import Page from '@/components/Page';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';
import * as S from './styles';

const ConversationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <S.Container>
        <Page.Header.LogoButton noMargins options={logoOptions} />
      </S.Container>
    </SharePopperProvider>
  );
};

export default ConversationsHeader;
