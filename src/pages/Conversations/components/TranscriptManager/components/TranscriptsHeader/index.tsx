import React from 'react';

import { ClickableText } from '@/components/Text';

import { Container } from './components';

const TranscriptsHeader = () => (
  <Container>
    <b>Conversations</b>
    <ClickableText>Add filters</ClickableText>
  </Container>
);

export default TranscriptsHeader;
