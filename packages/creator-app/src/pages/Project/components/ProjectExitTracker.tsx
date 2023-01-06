import * as Platform from '@voiceflow/platform-config';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useProjectExitTracking } from '@/pages/Project/hooks';

export type ProjectProps = RouteComponentProps;

const ProjectExitTracker: React.OldFC<{ nluType: Platform.Constants.NLUType; platform: Platform.Constants.PlatformType }> = ({
  nluType,
  platform,
}) => {
  useProjectExitTracking({ nluType, platform });

  return null;
};

export default ProjectExitTracker;
