import { IS_DEVELOPMENT, System } from '@voiceflow/ui';
import React from 'react';

import { useRealtimeClient } from '@/hooks';

const TIMEOUT_WARNING = IS_DEVELOPMENT ? 60 : 13;
const TIMEOUT_SILENT = 2;
const RECONNECT_TIMEOUT = TIMEOUT_SILENT + TIMEOUT_WARNING;

const RealtimeTimeoutControl: React.FC = () => {
  const [countdown, setCountdown] = React.useState(RECONNECT_TIMEOUT);
  const [terminated, setTerminated] = React.useState(false);

  const client = useRealtimeClient();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => {
        if (countdown >= 1) return countdown - 1;

        clearInterval(interval);
        setTerminated(true);
        client.destroy();

        return countdown;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // hide for the first few seconds (standard reconnect should be fast)
  if (countdown > RECONNECT_TIMEOUT - TIMEOUT_SILENT) return null;

  return (
    <System.Snackbar.WithOverlay showOverlay={terminated}>
      <System.Snackbar.Icon icon="warning" />

      <System.Snackbar.Text>
        {terminated ? <>You're offline. Restore connection to continue working</> : <>You’re offline, trying to reconnect: {countdown}</>}
      </System.Snackbar.Text>

      {terminated && <System.Snackbar.Button onClick={() => window.location.reload()}>Reload</System.Snackbar.Button>}
    </System.Snackbar.WithOverlay>
  );
};

export default RealtimeTimeoutControl;
