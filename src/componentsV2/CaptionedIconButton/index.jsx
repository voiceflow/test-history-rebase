import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Label } from './components';

function CaptionedIconButton({ icon, children, ...props }) {
  return (
    <Container {...props}>
      <SvgIcon icon={icon} color="#becedc" />
      <Label>{children.toUpperCase()}</Label>
    </Container>
  );
}

export default CaptionedIconButton;
