import React from 'react';

import FullPageTemplate from '../FullPageTemplate';
import { MobileVoiceInstruction, StartConversation } from './components';

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

  if (isVisuals && isMobile && visualsWelcomeScreenPassed) {
    return <MobileVoiceInstruction onStart={onStart} colorScheme={colorScheme} />;
  }

  return (
    <FullPageTemplate
      colorScheme={colorScheme}
      centerAlign={isVisuals || isMobile}
      isVisuals={isVisuals}
      isMobile={isMobile}
      logoSize={logoSize}
      logoURL={logoURL}
    >
      <StartConversation
        projectName={projectName}
        isMobile={isMobile}
        setVisualsWelcomeScreenPassed={setVisualsWelcomeScreenPassed}
        onStart={onStart}
        isVisuals={isVisuals}
        withStartButton={withStartButton}
        colorScheme={colorScheme}
      />
    </FullPageTemplate>
  );
};

export default ShareSplashScreen;
