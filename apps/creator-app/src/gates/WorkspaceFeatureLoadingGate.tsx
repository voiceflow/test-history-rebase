import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const WorkspaceFeatureLoadingGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isLoaded = useSelector(Feature.isWorkspaceLoadedSelector);
  const hasActiveWorkspace = useSelector(Session.hasActiveWorkspaceSelector);

  const loadFeatures = useDispatch(Feature.loadWorkspaceFeatures);

  return (
    <LoadingGate
      load={loadFeatures}
      label="Workspace Features"
      isLoaded={!hasActiveWorkspace || isLoaded}
      component={WorkspaceOrProjectLoader}
      internalName={WorkspaceFeatureLoadingGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default WorkspaceFeatureLoadingGate;
