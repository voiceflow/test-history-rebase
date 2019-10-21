import React from 'react';

import { HeaderPortal } from '@/components/Page';
import { TestingModeContext } from '@/containers/CanvasV2/contexts';

import ProjectHeader from './ProjectHeader';
import TestingHeader from './Testing/TestingHeader';

const CanvasHeader = () => {
  const isTesting = React.useContext(TestingModeContext);

  return <HeaderPortal>{isTesting ? <TestingHeader /> : <ProjectHeader />}</HeaderPortal>;
};

export default CanvasHeader;
