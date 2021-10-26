import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Workspace from '@/ducks/workspace';
import { withoutFeatureGate } from '@/hocs';
import { useDispatch } from '@/hooks';

const WorkspacesLoadingGate: React.FC = ({ children }) => {
  const loadWorkspaces = useDispatch(Workspace.loadWorkspaces);

  const [isLoaded, setLoaded] = React.useState(false);

  const load = React.useCallback(async () => {
    await loadWorkspaces();

    setLoaded(true);
  }, []);

  return (
    <LoadingGate label="Workspaces" isLoaded={isLoaded} load={load} zIndex={50} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

/**
 * @deprecated
 */
export default withoutFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(WorkspacesLoadingGate);
