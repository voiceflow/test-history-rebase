import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { withoutFeatureGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

/**
 * @deprecated no longer reqiured with atomic actions
 */
const WorkspaceMembersLoadingGate: React.FC = ({ children }) => {
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const [loaded, setLoaded] = React.useState(false);

  const loadMembers = useDispatch(Workspace.loadMembers, activeWorkspaceID!);
  const stateLoadMembers = React.useCallback(async () => {
    setLoaded(false);
    await loadMembers();
    setLoaded(true);
  }, [loadMembers]);

  return (
    <LoadingGate label="Members" isLoaded={loaded} load={stateLoadMembers} zIndex={50} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withoutFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(WorkspaceMembersLoadingGate);
