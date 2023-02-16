import { Box, preventDefault } from '@voiceflow/ui';
import React from 'react';

import { Container, ContentContainer } from '../../common';
import StartButton from './StartButton';

interface MobileVoiceInstructionProps {
  onStart: () => void;
  colorScheme?: string;
}

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
