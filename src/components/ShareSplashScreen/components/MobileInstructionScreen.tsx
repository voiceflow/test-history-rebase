import React from 'react';

import Box from '@/components/Box';

import { Container, ContentContainer, StartButton } from '.';

type MobileInstructionScreenProps = {
  colorScheme?: string;
  onStart: () => void;
};
const MobileInstructionScreen: React.FC<MobileInstructionScreenProps> = ({ onStart, colorScheme }) => {
  return (
    <Container>
      <ContentContainer centerAlign>
        <Box>
          <Box fontSize={22} mb={38} color="#132144">
            This is a voice prototype, hold anywhere on the screen and talk to interact.
          </Box>
          <StartButton onClick={onStart} color={colorScheme}>
            Got It!
          </StartButton>
        </Box>
      </ContentContainer>
    </Container>
  );
};

export default MobileInstructionScreen;
