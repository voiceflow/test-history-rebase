import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Session from '@/ducks/session';
import { useOneTimeEffect, usePageAwareTeardown, useProjectSubscription, useRealtimeDispatch, useSelector } from '@/hooks';

const RealtimeProjectSubscription: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const isSubscribing = useProjectSubscription(projectID);
  const dispatch = useRealtimeDispatch();

  useOneTimeEffect(() => {
    if (isSubscribing) return false;

    dispatch.local(Realtime.project.local.reset({ projectID: projectID! }));

    return true;
  }, [isSubscribing]);

  usePageAwareTeardown(() => {
    dispatch.local(Realtime.project.local.reset({ projectID: projectID! }));
  });

  return null;
};

export default RealtimeProjectSubscription;
