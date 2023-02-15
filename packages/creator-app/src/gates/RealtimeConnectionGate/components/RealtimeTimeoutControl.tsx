import { Snackbar } from '@voiceflow/ui';
import React from 'react';

import { useRealtimeClient } from '@/hooks';

export const RECONNECT_TIMEOUT = 10;

const RealtimeTimeoutControl: React.FC = () => {
  const [countdown, setCountdown] = React.useState(RECONNECT_TIMEOUT);
  const [terminated, setTerminated] = React.useState(false);

  const client = useRealtimeClient();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown < 1) {
          clearInterval(interval);
          setTerminated(true);
          client.destroy();

          return countdown;
        }
        return countdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Snackbar isOpen showOverlay={terminated}>
      <Snackbar.Icon icon="warning" />
      <Snackbar.Text>
        {terminated ? <>You're offline. Restore connection to continue working</> : <>You’re offline, trying to reconnect: {countdown}</>}
      </Snackbar.Text>
      {terminated && <Snackbar.DarkButton onClick={() => window.location.reload()}>Reload</Snackbar.DarkButton>}
    </Snackbar>
  );
};

export default RealtimeTimeoutControl;
