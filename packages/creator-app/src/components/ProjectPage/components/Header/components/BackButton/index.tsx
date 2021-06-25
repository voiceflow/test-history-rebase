import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { StyledBackButton } from './components';

const BackButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <StyledBackButton {...props}>
    <SvgIcon icon="arrowLeft" size={14} color="#6e849a" />

    <span>Back</span>
  </StyledBackButton>
);

export default BackButton;
