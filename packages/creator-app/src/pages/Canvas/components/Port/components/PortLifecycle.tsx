import React from 'react';

import { PortEntityContext } from '@/pages/Canvas/contexts';

const PortLifecycle: React.OldFC = () => {
  const portEntity = React.useContext(PortEntityContext)!;

  portEntity.useLifecycle();

  return null;
};

export default PortLifecycle;
