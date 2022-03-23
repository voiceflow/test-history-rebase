import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useProjectExitTracking } from '@/pages/Project/hooks';

export type ProjectProps = RouteComponentProps;

const ProjectExitTracker: React.FC<{ platform: VoiceflowConstants.PlatformType }> = ({ platform }) => {
  useProjectExitTracking({ platform });

  return null;
};

export default ProjectExitTracker;
