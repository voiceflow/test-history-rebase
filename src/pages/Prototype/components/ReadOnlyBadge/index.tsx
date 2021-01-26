import React from 'react';

import Icon from '@/components/SvgIcon';
import { useEnableDisable } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { FadeLeftContainer } from '@/styles/animations';

import { Container } from './style';

const blinkDuration = 2000;
export const READONLY_CLICK_EVENT_NAME = 'prototypeReadOnlyClick';

const ReadOnlyBadge: React.FC = () => {
  const isPrototypingMode = usePrototypingMode();
  const [blinking, enableBlinking, disableBlinking] = useEnableDisable(false);

  React.useEffect(() => {
    const runBlinkAnimation = () => {
      enableBlinking();
      setTimeout(() => {
        disableBlinking();
      }, [blinkDuration]);
    };
    window.addEventListener(READONLY_CLICK_EVENT_NAME, runBlinkAnimation);

    return () => {
      window.removeEventListener(READONLY_CLICK_EVENT_NAME, runBlinkAnimation);
    };
  });

  return isPrototypingMode ? (
    <Container runBlink={blinking}>
      <FadeLeftContainer>
        <Icon icon="eye" />
        <span>Read only</span>
      </FadeLeftContainer>
    </Container>
  ) : null;
};

export default ReadOnlyBadge;
