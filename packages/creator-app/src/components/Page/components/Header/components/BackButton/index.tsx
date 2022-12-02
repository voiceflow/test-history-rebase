import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const BackButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { navSidebarWidth?: boolean }> = (props) => (
  <S.StyledBackButton {...props}>
    <SvgIcon icon="arrowToggle" width={12} color="#6e849a" rotation={270} />

    <span>Back</span>
  </S.StyledBackButton>
);

export default BackButton;
