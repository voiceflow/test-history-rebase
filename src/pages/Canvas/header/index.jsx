import React from 'react';

import { HeaderPortal } from '@/components/Page';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import { EditPermissionContext } from '@/pages/Canvas/contexts';

import ProjectHeader from './ProjectHeader';
import TestingHeader from './Testing/TestingHeader';
import TestingHeaderV2 from './Testing/TestingHeaderV2';

const CanvasHeader = () => {
  const { isTesting } = React.useContext(EditPermissionContext);
  const testToolV2 = useFeature(FeatureFlag.TEST_TOOL_V2);

  // eslint-disable-next-line no-nested-ternary
  return <HeaderPortal>{isTesting ? testToolV2.isEnabled ? <TestingHeaderV2 /> : <TestingHeader /> : <ProjectHeader />}</HeaderPortal>;
};

export default CanvasHeader;
