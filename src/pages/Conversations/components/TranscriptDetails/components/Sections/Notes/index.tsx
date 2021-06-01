import React from 'react';

import { FlexCenter } from '@/components/Flex';

import { Container, SectionTitle } from '../components';

const Notes = () => (
  <Container curved flex={3}>
    <SectionTitle>NOTES</SectionTitle>
    <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Notes - </FlexCenter>
  </Container>
);

export default Notes;
