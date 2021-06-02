import React from 'react';

import client from '@/client';
import { useInterval } from '@/hooks';

const HEARTBEAT_TIMEOUT = 1000;

const RealtimeDiagramHeartbeat: React.FC = () => {
  useInterval(() => client.socket.diagram.sendHeartbeat(), HEARTBEAT_TIMEOUT);

  return null;
};

export default RealtimeDiagramHeartbeat;
