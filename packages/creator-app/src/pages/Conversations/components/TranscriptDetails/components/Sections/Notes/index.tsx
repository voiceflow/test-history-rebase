import React from 'react';

import EmojiPicker, { EMOJI_OPTION } from '@/components/EmojiPicker';
import { FAN_DIRECTION } from '@/components/EmojiPicker/constants';

import { Container, SectionTitle } from '../components';
import TranscriptNotes from './TranscriptNotes';

const Notes = () => (
  <Container curved>
    <SectionTitle>
      NOTES
      <EmojiPicker fanDirection={FAN_DIRECTION.LEFT} options={[EMOJI_OPTION.HAPPY, EMOJI_OPTION.NEUTRAL, EMOJI_OPTION.SAD]} />
    </SectionTitle>
    <TranscriptNotes />
  </Container>
);

export default Notes;
