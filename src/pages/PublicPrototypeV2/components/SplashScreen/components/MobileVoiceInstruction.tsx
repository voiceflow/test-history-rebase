import React from 'react';

import Box from '@/components/Box';
import { preventDefault } from '@/utils/dom';

import Container from './Container';
import ContentContainer from './ContentContainer';
import StartButton from './StartButton';

type MobileVoiceInstructionProps = {
  onStart: () => void;
  colorScheme?: string;
};

const MobileVoiceInstruction: React.FC<MobileVoiceInstructionProps> = ({ onStart, colorScheme }) => (
  <Container isMobile>
    <ContentContainer centerAlign>
      <Box>
        <Box fontSize={22} mb={38} color="#132144">
          This is a voice prototype, hold anywhere on the screen and talk to interact.
        </Box>

        <StartButton onClick={preventDefault(() => onStart())} color={colorScheme}>
          Got It!
        </StartButton>
      </Box>
    </ContentContainer>
  </Container>
);

export default MobileVoiceInstruction;
