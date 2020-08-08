import React from 'react';

import { HeaderPortal } from '@/components/Page';
import { usePrototypingMode } from '@/pages/Skill/hooks';

import ProjectHeader from './ProjectHeader';
import PrototypeHeader from './Prototype/PrototypeHeader';

const CanvasHeader = () => {
  const isPrototypingMode = usePrototypingMode();

  return <HeaderPortal>{isPrototypingMode ? <PrototypeHeader /> : <ProjectHeader />}</HeaderPortal>;
};

export default CanvasHeader;
