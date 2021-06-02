import React from 'react';

import FullPageTemplate from '../FullPageTemplate';
import { MobileVoiceInstruction, StartConversation } from './components';

interface ShareSplashScreenProps {
  onStart: () => void;
  logoURL?: string;
  isMobile?: boolean;
  logoSize?: number;
  isVisuals?: boolean;
  projectName: string;
  colorScheme?: string;
  hideVFBranding?: boolean;
  withStartButton?: boolean;
}

const ShareSplashScreen: React.FC<ShareSplashScreenProps> = ({
  onStart,
  logoURL,
  isMobile,
  logoSize,
  isVisuals,
  colorScheme,
  projectName,
  hideVFBranding,
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
      hideVFBranding={hideVFBranding}
    >
      <StartConversation
        projectName={projectName}
        isMobile={isMobile}
        setVisualsWelcomeScreenPassed={setVisualsWelcomeScreenPassed}
        onStart={onStart}
        isVisuals={isVisuals}
        withStartButton={withStartButton}
        colorScheme={colorScheme}
        hideVFBranding={hideVFBranding}
      />
    </FullPageTemplate>
  );
};

export default ShareSplashScreen;
