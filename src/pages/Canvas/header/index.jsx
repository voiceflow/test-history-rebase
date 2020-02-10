import React from 'react';

import { HeaderPortal } from '@/components/Page';
import { EditPermissionContext } from '@/pages/Canvas/contexts';

import ProjectHeader from './ProjectHeader';
import TestingHeader from './Testing/TestingHeader';

const CanvasHeader = () => {
  const { isTesting } = React.useContext(EditPermissionContext);

  return <HeaderPortal>{isTesting ? <TestingHeader /> : <ProjectHeader />}</HeaderPortal>;
};

export default CanvasHeader;
