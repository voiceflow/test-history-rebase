import React from 'react';

import { FlexCenter } from '@/components/Flex';

import { Container, DialogHeader } from './components';

const TranscriptDialog = () => (
  <Container>
    <DialogHeader />
    <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Transcript Dialog - </FlexCenter>
  </Container>
);

export default TranscriptDialog;
