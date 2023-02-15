import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';
import React from 'react';

import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useStore, useTrackingEvents } from '@/hooks';

const SessionTracker: React.FC = () => {
  const [trackEvents] = useTrackingEvents();
  const store = useStore();

  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const workspacesEmpty = useSelector(WorkspaceV2.workspacesEmptySelector);

  const createSessionTracker = React.useCallback((startTime: number) => {
    let called = false;

    return () => {
      if (called) return;

      called = true;
      trackEvents.trackSessionDuration(Date.now() - startTime);
    };
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn || workspacesEmpty) return undefined;

    const state = store.getState();

    const email = Account.userEmailSelector(state);
    const creatorID = Account.userIDSelector(state);
    const workspaceIDs = WorkspaceV2.allWorkspaceIDsSelector(state);
    const allWorkspaces = WorkspaceV2.allWorkspacesSelector(state);
    const trackSessionTime = createSessionTracker(Date.now());

    const roles = allWorkspaces
      .map((workspace) => Normal.denormalize(workspace.members).find((member) => member.creator_id === creatorID)?.role)
      .filter(Utils.array.isNotNullish);

    trackEvents.trackSessionBegin(workspaceIDs, email, roles);
    window.addEventListener('beforeunload', trackSessionTime);

    return () => {
      trackSessionTime();
      window.removeEventListener('beforeunload', trackSessionTime);
    };
  }, [isLoggedIn, workspacesEmpty]);

  return null;
};

export default SessionTracker;
