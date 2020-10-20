import React from 'react';

import { useCanvasMode, usePrototypingMode } from '@/pages/Skill/hooks';

import ProjectHeader from './ProjectHeader';
import PrototypeHeader from './Prototype/PrototypeHeader';

const CanvasHeader = () => {
  const isPrototypingMode = usePrototypingMode();
  const isCanvasMode = useCanvasMode();

  if (isPrototypingMode) {
    return <PrototypeHeader />;
  }
  if (isCanvasMode) {
    return <ProjectHeader />;
  }
  return null;
};

export default CanvasHeader;
