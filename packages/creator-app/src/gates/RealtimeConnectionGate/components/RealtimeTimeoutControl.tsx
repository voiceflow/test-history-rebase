import { Animations, Box, Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

export const RECONNECT_TIMEOUT = 10;

const RealtimeWarningBarContainer = styled(Box.FlexCenter)`
  ${Animations.FadeDownDelayed}
  box-shadow: inset rgb(0 0 0 / 50%) 0px -1px 0px 0px, rgb(0 0 0 / 16%) 0px 1px 3px 0px;
  padding: 6px;
  color: #f2f7f7;
  height: 40px;
  background: #33373a;
  border-radius: 10px;
  font-size: 13px;
`;

const RealtimeWarningBarWrapper = styled.div`
  position: absolute;
  z-index: 1001;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
`;

const BlockingLayer = styled.div`
  position: absolute;
  z-index: 1000;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: 0.65;

  cursor-events: none;
`;

const RealtimeTimeoutControl: React.FC = () => {
  const [countdown, setCountdown] = React.useState(RECONNECT_TIMEOUT);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown <= 1) clearInterval(interval);
        return countdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const terminated = countdown <= 0;

  return (
    <>
      {terminated && <BlockingLayer />}
      <RealtimeWarningBarWrapper>
        <RealtimeWarningBarContainer>
          <SvgIcon icon="warning" mx={12} />
          {terminated ? (
            <>
              You're offline. Restore connection to continue working
              <Button.DarkButton px={12} py={5} ml={16} onClick={() => window.location.reload()}>
                Reload
              </Button.DarkButton>
            </>
          ) : (
            <Box mr={16}>You’re offline, trying to reconnect: {countdown}</Box>
          )}
        </RealtimeWarningBarContainer>
      </RealtimeWarningBarWrapper>
    </>
  );
};

export default RealtimeTimeoutControl;
