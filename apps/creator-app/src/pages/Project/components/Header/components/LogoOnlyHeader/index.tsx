import React from 'react';

import Page from '@/components/Page';

import { useLogoButtonOptions } from '../../hooks';
import * as S from './styles';

const ConversationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <S.Container>
      <Page.Header.LogoButton noMargins options={logoOptions} />
    </S.Container>
  );
};

export default ConversationsHeader;
