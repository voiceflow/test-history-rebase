import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

const AssistantLoadingGate: React.FC = ({ children }) => {
  const hasActiveWorkspace = useSelector(Session.hasActiveWorkspaceSelector);
  const projects = useSelector(ProjectV2.allProjectsSelector);

  return (
    <LoadingGate
      internalName={AssistantLoadingGate.name}
      isLoaded={projects && hasActiveWorkspace}
      borderless
      hasLabel={false}
      full={false}
      fillContainer
    >
      {children}
    </LoadingGate>
  );
};

export default AssistantLoadingGate;
