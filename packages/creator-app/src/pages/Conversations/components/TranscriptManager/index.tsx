import React from 'react';

import { FlexCenter } from '@/components/Flex';

import { Container, TranscriptHeader } from './components';

const TranscriptManager = () => (
  <Container>
    <TranscriptHeader />
    <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Transcript List - </FlexCenter>
  </Container>
);

export default TranscriptManager;
