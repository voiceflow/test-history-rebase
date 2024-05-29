import React from 'react';

import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useStore, useTrackingEvents } from '@/hooks';

const SessionTracker: React.FC = () => {
  const [trackEvents] = useTrackingEvents();
  const store = useStore();

  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const workspacesEmpty = useSelector(WorkspaceV2.workspacesEmptySelector);

  const createSessionTracker = React.useCallback(
    ({ creatorID, startTime }: { startTime: number; creatorID: number }) =>
      () =>
        trackEvents.trackSessionDuration({ creatorID, duration: Math.floor((Date.now() - startTime) / 1000) }),
    []
  );

  React.useEffect(() => {
    if (!isLoggedIn || workspacesEmpty) return;

    const state = store.getState();

    const email = Account.userEmailSelector(state)!;
    const creatorID = Account.userIDSelector(state)!;
    const workspaceIDs = WorkspaceV2.allWorkspaceIDsSelector(state);
    const allWorkspaceMembers = Organization.workspaceMembersSelector(state);

    const roles = allWorkspaceMembers.filter((member) => member.creatorID === creatorID).map((member) => member.role);

    trackEvents.trackSessionBegin({ email, roles, creatorID, workspaceIDs });
  }, [isLoggedIn, workspacesEmpty]);

  React.useEffect(() => {
    if (!isLoggedIn) return undefined;

    const state = store.getState();

    const creatorID = Account.userIDSelector(state)!;
    const trackSessionTime = createSessionTracker({ creatorID, startTime: Date.now() });

    window.addEventListener('beforeunload', trackSessionTime);

    return () => {
      trackSessionTime();
      window.removeEventListener('beforeunload', trackSessionTime);
    };
  }, [isLoggedIn]);

  return null;
};

export default SessionTracker;
