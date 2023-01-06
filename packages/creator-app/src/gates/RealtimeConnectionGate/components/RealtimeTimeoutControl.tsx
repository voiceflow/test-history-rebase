import { Snackbar } from '@voiceflow/ui';
import React from 'react';

export const RECONNECT_TIMEOUT = 10;

const RealtimeTimeoutControl: React.OldFC = () => {
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
