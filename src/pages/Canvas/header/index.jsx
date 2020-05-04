import React from 'react';

import { HeaderPortal } from '@/components/Page';
import { EditPermissionContext } from '@/pages/Canvas/contexts';

import ProjectHeader from './ProjectHeader';
import PrototypeHeader from './Prototype/PrototypeHeader';

const CanvasHeader = () => {
  const { isPrototyping } = React.useContext(EditPermissionContext);

  // eslint-disable-next-line no-nested-ternary
  return <HeaderPortal>{isPrototyping ? <PrototypeHeader /> : <ProjectHeader />}</HeaderPortal>;
};

export default CanvasHeader;
