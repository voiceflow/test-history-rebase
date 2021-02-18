import React from 'react';

import Box from '@/components/Box';
import { Link, Text } from '@/components/Text/components';
import { preventDefault } from '@/utils/dom';

import { BoxLogo, Container, ContentContainer, MobileVoiceInstruction, StartButton, WaterMark } from './components';

type ShareSplashScreenProps = {
  onStart: () => void;
  logoURL?: string;
  isMobile?: boolean;
  logoSize?: number;
  isVisuals?: boolean;
  projectName: string;
  colorScheme?: string;
  withStartButton?: boolean;
};
const ShareSplashScreen: React.FC<ShareSplashScreenProps> = ({
  onStart,
  logoURL,
  isMobile,
  logoSize,
  isVisuals,
  colorScheme,
  projectName,
  withStartButton = true,
}) => {
  const [visualsWelcomeScreenPassed, setVisualsWelcomeScreenPassed] = React.useState(false);
  const centerAlign = isMobile || isVisuals;

  if (isVisuals && isMobile && visualsWelcomeScreenPassed) {
    return <MobileVoiceInstruction onStart={onStart} colorScheme={colorScheme} />;
  }

  return (
    <Container isVisuals={isVisuals} isMobile={isMobile}>
      <ContentContainer centerAlign={centerAlign}>
        <Box mb={50}>
          <BoxLogo url={logoURL} size={logoSize} />

          <Box fontSize={24}>
            You've been invited to have a conversation with <Text color="#5D9DF5">{projectName}</Text>
          </Box>

          <Box fontSize={15} mt={16} mb={32} color="#62778c">
            Want to create your own? <Link href="/">Get Started.</Link>
          </Box>

          {withStartButton && (
            <StartButton
              color={colorScheme}
              onClick={preventDefault(() => (isVisuals && isMobile ? setVisualsWelcomeScreenPassed(true) : onStart()))}
            >
              Start Conversation
            </StartButton>
          )}
        </Box>
      </ContentContainer>

      <WaterMark color="#8da2b5" width="100%" display="inline-block" textAlign={centerAlign ? 'center' : undefined}>
        Conversation{' '}
        <span role="img" aria-label="powered">
          ⚡
        </span>{' '}
        by <Link href="https://voiceflow.com">Voiceflow</Link>
      </WaterMark>
    </Container>
  );
};

export default ShareSplashScreen;
