import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useWorkspaceSubscription } from '@/hooks';
import { ConnectedProps } from '@/types';

const RealtimeWorkspaceSubscription: React.FC<RealtimeWorkspaceSubscriptionConnectedProps> = ({ workspaceID }) => {
  useWorkspaceSubscription(workspaceID);

  return null;
};

const mapStateToProps = {
  workspaceID: Session.activeWorkspaceIDSelector,
};

type RealtimeWorkspaceSubscriptionConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(RealtimeWorkspaceSubscription);
