import React from 'react';

import * as Session from '@/ducks/session';
import { useSelector, useWorkspaceSubscription } from '@/hooks';

const RealtimeWorkspaceSubscription: React.FC = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  useWorkspaceSubscription(workspaceID);

  return null;
};

export default RealtimeWorkspaceSubscription;
