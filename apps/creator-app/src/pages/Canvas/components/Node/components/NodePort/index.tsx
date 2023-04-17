import React from 'react';

import { PortEntityContext } from '@/pages/Canvas/contexts';

import { usePortInstance } from './hooks';

export interface NodePortProps {
  getAnchorPoint: () => DOMRect | null;
}

const NodePort: React.FC<NodePortProps> = ({ getAnchorPoint }) => {
  const portEntity = React.useContext(PortEntityContext)!;
  const instance = usePortInstance(getAnchorPoint);

  portEntity.useInstance(instance);
  portEntity.useLifecycle();

  return null;
};

export default React.memo(NodePort);
