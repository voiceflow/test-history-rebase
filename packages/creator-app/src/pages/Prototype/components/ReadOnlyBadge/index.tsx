import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable } from '@/hooks';
import { usePrototypingMode } from '@/pages/Project/hooks';
import { FadeLeftContainer } from '@/styles/animations';

import { Container } from './style';

const BLINK_DURATION = 2000;
export const READONLY_CLICK_EVENT_NAME = 'prototypeReadOnlyClick';

const ReadOnlyBadge: React.FC = () => {
  const isPrototypingMode = usePrototypingMode();
  const [blinking, enableBlinking, disableBlinking] = useEnableDisable(false);

  React.useEffect(() => {
    const runBlinkAnimation = () => {
      enableBlinking();
      setTimeout(() => {
        disableBlinking();
      }, BLINK_DURATION);
    };
    window.addEventListener(READONLY_CLICK_EVENT_NAME, runBlinkAnimation);

    return () => {
      window.removeEventListener(READONLY_CLICK_EVENT_NAME, runBlinkAnimation);
    };
  });

  return isPrototypingMode ? (
    <Container runBlink={blinking}>
      <FadeLeftContainer>
        <SvgIcon icon="eye" />
        <span>Read only</span>
      </FadeLeftContainer>
    </Container>
  ) : null;
};

export default ReadOnlyBadge;
