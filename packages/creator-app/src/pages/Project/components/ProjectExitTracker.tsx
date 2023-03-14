import React from 'react';

import { useProjectExitTracking } from '@/pages/Project/hooks';

const ProjectExitTracker: React.FC = () => {
  useProjectExitTracking();

  return null;
};

export default React.memo(ProjectExitTracker);
