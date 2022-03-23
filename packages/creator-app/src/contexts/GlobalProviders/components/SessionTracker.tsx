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

    const workspaceIDs = WorkspaceV2.allWorkspaceIDsSelector(store.getState());
    const trackSessionTime = createSessionTracker(Date.now());

    trackEvents.trackSessionBegin(workspaceIDs);
    window.addEventListener('beforeunload', trackSessionTime);

    return () => {
      trackSessionTime();
      window.removeEventListener('beforeunload', trackSessionTime);
    };
  }, [isLoggedIn, workspacesEmpty]);

  return null;
};

export default SessionTracker;
