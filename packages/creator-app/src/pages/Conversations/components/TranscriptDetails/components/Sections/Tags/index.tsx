import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { ClickableText } from '@/components/Text';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Container, SectionTitle } from '../components';

const Notes = () => {
  const { open: openTagManager } = useModals(ModalType.TAG_MANAGER);

  return (
    <Container>
      <SectionTitle>
        TAGS
        <ClickableText onClick={openTagManager}>Manager</ClickableText>
      </SectionTitle>
      <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Tags - </FlexCenter>
    </Container>
  );
};

export default Notes;
