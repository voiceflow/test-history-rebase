import React from 'react';

import client from '@/client';

const HEARTBEAT_TIMEOUT = 1000;

const RealtimeDiagramHeartbeat: React.FC = () => {
  const [timeoutCounter, setTimeoutCounter] = React.useState(0);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      client.socket.diagram.sendHeartbeat();
      setTimeoutCounter(timeoutCounter + 1);
    }, HEARTBEAT_TIMEOUT);
    return () => clearTimeout(interval);
  }, [timeoutCounter]);

  return null;
};

export default RealtimeDiagramHeartbeat;
