import React from 'react';

import { FlexCenter } from '@/components/Flex';

import { Container, SectionTitle } from '../components';

const Notes = () => (
  <Container>
    <SectionTitle>TAGS</SectionTitle>
    <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Tags - </FlexCenter>
  </Container>
);

export default Notes;
