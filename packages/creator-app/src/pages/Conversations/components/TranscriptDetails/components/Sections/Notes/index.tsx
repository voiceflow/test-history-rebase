import React from 'react';

import EmojiPicker, { EMOJI_OPTION } from '@/components/EmojiPicker';
import { FAN_DIRECTION } from '@/components/EmojiPicker/constants';
import { FlexCenter } from '@/components/Flex';

import { Container, SectionTitle } from '../components';

const Notes = () => (
  <Container curved flex={3}>
    <SectionTitle>
      NOTES
      <EmojiPicker fanDirection={FAN_DIRECTION.LEFT} options={[EMOJI_OPTION.HAPPY, EMOJI_OPTION.NEUTRAL, EMOJI_OPTION.SAD]} />
    </SectionTitle>
    <FlexCenter style={{ flex: 2, color: '#8da2b5' }}> - Notes - </FlexCenter>
  </Container>
);

export default Notes;
