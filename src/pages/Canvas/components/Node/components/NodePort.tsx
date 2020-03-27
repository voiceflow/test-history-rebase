import React from 'react';

import { usePortSubscription } from '@/pages/Canvas/components/PortV2/hooks';

import { usePortAPI } from '../hooks';

export type NodePortProps = {
  portID: string;
  getAnchorPoint: () => DOMRect;
};

const NodePort: React.FC<NodePortProps> = ({ getAnchorPoint, portID }) => {
  const api = usePortAPI(getAnchorPoint);

  usePortSubscription(portID, api);

  return null;
};

export default NodePort;
