import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useOneTimeEffect, usePageAwareTeardown, useProjectSubscription, useRealtimeDispatch } from '@/hooks';
import { ConnectedProps } from '@/types';

const RealtimeProjectSubscription: React.FC<RealtimeProjectSubscriptionConnectedProps> = ({ tabID, user, projectID }) => {
  const isSubscribing = useProjectSubscription(projectID);
  const dispatch = useRealtimeDispatch();

  useOneTimeEffect(() => {
    if (isSubscribing) return false;

    dispatch.local(Realtime.project.local.reset({ projectID: projectID! }));
    dispatch.sync(
      Realtime.project.identifyViewer({
        tabID,
        projectID: projectID!,
        viewer: {
          name: user.name!,
          creatorID: user.creator_id!,
          image: user.image!,
        },
      })
    );

    return true;
  }, [isSubscribing]);

  usePageAwareTeardown(() => {
    dispatch.sync(Realtime.project.forgetViewer({ projectID: projectID!, tabID }));
    dispatch.local(Realtime.project.local.reset({ projectID: projectID! }));
  });

  return null;
};

const mapStateToProps = {
  tabID: Session.tabIDSelector,
  user: Account.userSelector,
  projectID: Session.activeProjectIDSelector,
};

type RealtimeProjectSubscriptionConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(RealtimeProjectSubscription);
