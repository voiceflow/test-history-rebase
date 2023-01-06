import React from 'react';

import { usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';

const PrototypeOverlay: React.OldFC = () => {
  const isPrototypingMode = usePrototypingMode();

  return !isPrototypingMode ? null : <PrototypeSidebar />;
};

export default PrototypeOverlay;
