import React from 'react';

import { NodeEntityContext } from '@/pages/Canvas/contexts';

const NodeLifecycle: React.OldFC = () => {
  const nodeEntity = React.useContext(NodeEntityContext)!;

  nodeEntity.useLifecycle();

  return null;
};

export default React.memo(NodeLifecycle);
