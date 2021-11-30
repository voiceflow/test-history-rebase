import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as ProjectList from '@/ducks/projectList';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { withoutFeatureGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

const ProjectListsGate: React.FC = ({ children }) => {
  const loadLists = useDispatch(ProjectList.loadProjectLists);
  const setLoadingProjects = useDispatch(UI.setLoadingProjects);

  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const [hasLoadedProjects, setHasLoadedProjects] = React.useState(false);

  const loadProjectLists = React.useCallback(async () => {
    if (!activeWorkspaceID) return;

    setLoadingProjects(true);
    await loadLists(activeWorkspaceID);
    setLoadingProjects(false);
    setHasLoadedProjects(true);
  }, [activeWorkspaceID]);

  return (
    <LoadingGate label="Projects" isLoaded={hasLoadedProjects} load={loadProjectLists}>
      {children}
    </LoadingGate>
  );
};

/**
 * @deprecated project list sync is managed by the new realtime system
 */
export default withoutFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(ProjectListsGate);
