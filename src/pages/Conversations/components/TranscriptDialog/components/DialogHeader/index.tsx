import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';

import { Container } from './components';

const DialogHeader = () => (
  <Container>
    <b>Transcript</b>
    <IconButton icon="elipsis" variant={IconButtonVariant.FLAT} />
  </Container>
);

export default DialogHeader;
