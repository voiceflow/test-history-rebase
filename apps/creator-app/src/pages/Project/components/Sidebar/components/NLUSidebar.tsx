import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import CanvasIconMenu from './CanvasIconMenu';
import LogoOffsetSidebar from './LogoOffsetSidebar';

const NLUSidebar: React.FC = () => {
  const nlu = useNLUManager();

  return nlu.inFullScreenTab ? <LogoOffsetSidebar /> : <CanvasIconMenu />;
};

export default NLUSidebar;
