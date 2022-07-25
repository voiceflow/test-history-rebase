import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { StyledBackButton } from './components';

const BackButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <StyledBackButton {...props}>
    <SvgIcon icon="arrowToggle" width={12} color="#6e849a" rotation={270} />

    <span>Back</span>
  </StyledBackButton>
);

export default BackButton;
