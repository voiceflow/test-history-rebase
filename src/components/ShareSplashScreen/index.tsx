import React from 'react';

import Box from '@/components/Box';
import ClickableText from '@/components/Text/components/ClickableText';

import { BoxLogo, Container, ContentContainer, StartButton, WaterMark } from './components';

type ShareSplashScreenProps = {
  projectName: string;
  colorScheme?: string;
  logoURL?: string;
  onStart: () => void;
  withStartButton?: boolean;
  centerAlign?: boolean;
  logoSize?: number;
};
const ShareSplashScreen: React.FC<ShareSplashScreenProps> = ({
  projectName,
  centerAlign = false,
  withStartButton = true,
  onStart,
  logoURL,
  colorScheme,
  logoSize,
}) => {
  return (
    <Container>
      <ContentContainer centerAlign={centerAlign}>
        <Box mb={50}>
          <BoxLogo img={logoURL} logoSize={logoSize} />
          <Box fontSize={24}>
            You've been invited to have a conversation with <ClickableText>{projectName}</ClickableText>
          </Box>
          <Box fontSize={15} mt={16} mb={32} color="#62778c">
            Want to create your own? <ClickableText>Get Started.</ClickableText>
          </Box>
          {withStartButton && (
            <StartButton onClick={onStart} color={colorScheme}>
              Start Conversation
            </StartButton>
          )}
        </Box>
      </ContentContainer>
      <WaterMark color="#8da2b5" width="100%" display="inline-block" centerAlign={centerAlign}>
        Conversation{' '}
        <span role="img" aria-label="powered">
          ⚡
        </span>{' '}
        by <ClickableText>Voiceflow</ClickableText>
      </WaterMark>
    </Container>
  );
};

export default ShareSplashScreen;
