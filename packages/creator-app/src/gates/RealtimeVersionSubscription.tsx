import React from 'react';

import * as Session from '@/ducks/session';
import { useSelector, useVersionSubscription } from '@/hooks';

const RealtimeVersionSubscription: React.FC = () => {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);

  useVersionSubscription(projectID, versionID);

  return null;
};

export default RealtimeVersionSubscription;
